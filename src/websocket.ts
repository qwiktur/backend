import _ from 'lodash';
import { Server, Socket } from 'socket.io';
import ImageManager from './image-manager';
import Game from './model/game';
import Image from './model/image';
import Question from './model/question';
import Theme from './model/theme';
import User from './model/user';

export default class Websocket {

    private srv: Server;

    public constructor() {
        this.srv = null;
    }

    public start(port: number): void {
        if (!this.srv) {
            this.srv = new Server(port, {
                cors: {
                    origin: '*',
                    methods: ['GET', 'POST']
                }
            });
            this.createEvents();
        }
    }

    public stop(): void {
        if (this.srv) {
            this.srv.close();
            this.srv = null;
        }
    }

    private createEvents() {
        this.srv.on('connect', (socket: Socket) => {
            console.log(`Socket connected : ${socket.handshake.address}`);

            socket.on('disconnect', () => {
                socket.rooms.forEach(socket.rooms.delete);
                console.log(`Socket disconnected : ${socket.handshake.address}`);
            });

            socket.on(SocketEvent.CREATE, async (data: CreateClientToServer) => {
                try {
                    const { authorId, themeId } = data;
                    const author = await User.findById(authorId);
                    if (author != null) {
                        const theme = await Theme.findById(themeId);
                        const questions = _.sampleSize(await Question.find({ theme }), 100);
                        const images = await Image.find({ theme });
                        const game = await Game.create({
                            theme,
                            players: [author],
                            questions: questions.map(question => ({
                                target: question.id
                            })),
                            image: _.sample(images).id
                        });
                        socket.join(game.code);
                        socket.emit(SocketEvent.CREATE, { gameId: game.id } as CreateServerToClient);
                    } else {
                        socket.emit(SocketEvent.ERROR, { message: 'Author not found' } as ErrorServerToClient);
                    }
                } catch (err) {
                    socket.emit(SocketEvent.ERROR, { message: 'Server error' } as ErrorServerToClient);
                }
            });

            socket.on(SocketEvent.JOIN, async (data: JoinClientToServer) => {
                try {
                    const { code, userId } = data;
                    const game = await Game.findOne({ code });
                    if (game != null) {
                        const user = await User.findById(userId);
                        if (user != null) {
                            if (!game.players.map(player => player.id).includes(user.id)) {
                                game.players.push(user);
                                game.markModified('players');
                                await game.save();
                                socket.join(game.code);
                                this.broadcast(socket, game.code, SocketEvent.JOIN, { gameId: game.id } as JoinServerToClient);
                            } else {
                                socket.emit(SocketEvent.ERROR, { message: 'User is already in this game' } as ErrorServerToClient);
                            }
                        } else {
                            socket.emit(SocketEvent.ERROR, { message: 'User not found' } as ErrorServerToClient);
                        }
                    } else {
                        socket.emit(SocketEvent.ERROR, { message: 'Invalid code' } as ErrorServerToClient);
                    }
                } catch (err) {
                    socket.emit(SocketEvent.ERROR, { message: 'Server error' } as ErrorServerToClient);
                }
            });

            socket.on(SocketEvent.START, async (data: StartClientToServer) => {
                try {
                    const { code, userId } = data;
                    const game = await Game.findOne({ code }).select('+image').populate('players').populate('questions.target').populate('image');
                    if (game != null) {
                        const user = await User.findById(userId);
                        if (user != null) {
                            if (game.players[0].id === userId) {
                                const imgManager = new ImageManager(game.image);
                                await imgManager.load();
                                imgManager.blur(100);
                                this.broadcast(socket, game.code, SocketEvent.START, { questionId: game.questions[0].target.id, imgBase64: await imgManager.toBase64() } as StartServerToClient);
                            } else {
                                socket.emit(SocketEvent.ERROR, { message: 'User is not the author of this game' } as ErrorServerToClient);
                            }
                        } else {
                            socket.emit(SocketEvent.ERROR, { message: 'User not found' } as ErrorServerToClient);
                        }
                    } else {
                        socket.emit(SocketEvent.ERROR, { message: 'Invalid code' } as ErrorServerToClient);
                    }
                } catch (err) {
                    socket.emit(SocketEvent.ERROR, { message: 'Server error' } as ErrorServerToClient);
                }
            });

            socket.on(SocketEvent.ANSWER, async (data: AnswerClientToServer) => {
                try {
                    const { code, userId, questionId, choice } = data;
                    const game = await Game.findOne({ code }).select('+image').populate('questions.target').populate('questions.history.user').populate('image');
                    if (game != null) {
                        const user = await User.findById(userId);
                        if (user != null) {
                            const question = await Question.findById(questionId);
                            if (question != null) {
                                const currentGameQuestion = game.questions.find(gameQuestion => gameQuestion.target.id === question.id);
                                if (currentGameQuestion != null) {
                                    if (question.choices.some(questionChoice => questionChoice.label === choice)) {
                                        const history = game.questions.find(gameQuestion => gameQuestion.target.id === question.id).history;
                                        if (!history.some(historyPart => historyPart.user.id === userId)) {
                                            const correct = question.choices.find(currentChoice => currentChoice.correct).label === choice;
                                            history.push({ user: user.id, correct, time: 0 });
                                            await game.save();
                                            const imgManager = new ImageManager(game.image);
                                            await imgManager.load();
                                            let correctTotal = correct ? 1 : 0;
                                            for (const gameQuestion of game.questions) {
                                                correctTotal += gameQuestion.history.filter(historyPart => historyPart.user.id === userId && historyPart.correct).length;
                                            }
                                            imgManager.blur(100 - (correctTotal * 10));
                                            const currentGameQuestionIndex = _.indexOf(game.questions, currentGameQuestion);
                                            socket.emit(SocketEvent.ANSWER, {
                                                correct,
                                                nextQuestionId: (currentGameQuestionIndex < game.questions.length - 1) ? game.questions[currentGameQuestionIndex + 1].target.id : question.id,
                                                imgBase64: await imgManager.toBase64()
                                            } as AnswerServerToClient);
                                        } else {
                                            socket.emit(SocketEvent.ERROR, { message: 'Player has already answered' } as ErrorServerToClient);
                                        }
                                    } else {
                                        socket.emit(SocketEvent.ERROR, { message: 'Choice not found in this question' } as ErrorServerToClient);
                                    }
                                } else {
                                    socket.emit(SocketEvent.ERROR, { message: 'Question not found in this game' } as ErrorServerToClient);
                                }
                            } else {
                                socket.emit(SocketEvent.ERROR, { message: 'Question not found' } as ErrorServerToClient);
                            }
                        } else {
                            socket.emit(SocketEvent.ERROR, { message: 'User not found' } as ErrorServerToClient);
                        }
                    } else {
                        socket.emit(SocketEvent.ERROR, { message: 'Invalid code' } as ErrorServerToClient);
                    }
                } catch (err) {
                    socket.emit(SocketEvent.ERROR, { message: 'Server error' } as ErrorServerToClient);
                }
            });

            socket.on(SocketEvent.ANSWER_IMAGE, async (data: AnswerImageClientToServer) => {
                try {
                    const { code, userId, title } = data;
                    const game = await Game.findOne({ code }).select('+image').populate('image');
                    if (game != null) {
                        const user = await User.findById(userId);
                        if (user != null) {
                            const expected = title.toLowerCase().trim().replace(/ /g, '');
                            const required = game.image.title.toLowerCase().trim().replace(/ /g, '');
                            socket.emit(SocketEvent.ANSWER_IMAGE, { correct: expected === required } as AnswerImageServerToClient);
                        } else {
                            socket.emit(SocketEvent.ERROR, { message: 'User not found' } as ErrorServerToClient);
                        }
                    } else {
                        socket.emit(SocketEvent.ERROR, { message: 'Invalid code' } as ErrorServerToClient);
                    }
                } catch (err) {
                    socket.emit(SocketEvent.ERROR, { message: 'Server error' } as ErrorServerToClient);
                }
            });
        });
    }

    private broadcast(socket: Socket, room: string, event: string, data: unknown): void {
        socket.emit(event, data);
        socket.broadcast.to(room).emit(event, data);
    }
}

enum SocketEvent {
    CREATE = 'create',
    JOIN = 'join',
    START = 'start',
    ANSWER = 'answer',
    ANSWER_IMAGE = 'answer-image',
    ERROR = 'error'
}

interface CreateClientToServer {
    authorId: string;
    themeId: string;
}

interface CreateServerToClient {
    gameId: string;
}

interface JoinClientToServer {
    code: string;
    userId: string;
}

interface JoinServerToClient {
    gameId: string;
}

interface StartClientToServer {
    code: string;
    userId: string;
}

interface StartServerToClient {
    questionId: string;
    imgBase64: string;
}

interface AnswerClientToServer {
    code: string;
    userId: string;
    questionId: string;
    choice: string;
}

interface AnswerServerToClient {
    correct: boolean;
    nextQuestionId: string;
    imgBase64: string;
}

interface AnswerImageClientToServer {
    code: string;
    userId: string;
    title: string;
}

interface AnswerImageServerToClient {
    correct: boolean;
}

interface ErrorServerToClient {
    message: string;
}
