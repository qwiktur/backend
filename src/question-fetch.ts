import axios from 'axios';
import Question from './model/question';
import Theme from './model/theme';

interface OpenQuizzDbResponse {
    results: [{
        langue: string;
        categorie: string;
        question: string;
        reponse_correcte: string;
        autres_choix: string[];
    }];
}

export default {
    start: function(key: string, interval: number): void {
        setInterval(async () => {
            try {
                const res = await axios.get<OpenQuizzDbResponse>(`https://www.openquizzdb.org/api.php?key=${key}`);
                for (const result of res.data.results) {
                    if (!await Question.exists({ title: result.question })) {
                        const question = await Question.create({
                            title: result.question,
                            theme: (await Theme.findOne({ name: { $regex: new RegExp('^' + result.categorie, 'i') } })).id,
                            choices: result.autres_choix.map(choice => ({
                                label: choice,
                                correct: choice === result.reponse_correcte
                            }))
                        });
                        console.log(`New question fetched : "${question.title}"`);
                    }
                }
            } catch (err) {
                console.error('Could not fetch question from OpenQuizzDB :', err.message);
            }
        }, interval);
    }
}
