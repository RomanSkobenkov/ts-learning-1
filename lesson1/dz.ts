export default {}

type TInput = {
    type: 'input',
    answer: string,
    rightAnswer: string
}

type TRadio = {
    type: 'radio',
    answer: string,
    rightAnswer: string
}

type TCheckbox = {
    type: 'checkbox',
    answer: string[],
    rightAnswer: string[]
}

type TQuestion = {
    q: string,
    input: TInput | TRadio | TCheckbox,
}

createQuestion([
    {
        q: 'Чё каво?',
        input: {
            type: 'input',
            answer: 'Чё доебвался',
            rightAnswer: 'Да ничё никаво покашто'
        }
    },
    {
        q: 'выбирай что-то одно',
        input: {
            type: 'radio',
            answer: 'Выбрал',
            rightAnswer: 'Правильно выбрал'
        }
    },
    {
        q: 'Выбирай не что-то одно',
        input: {
            type: 'checkbox',
            answer: ['выбрал это', 'и ещё вот это', ' и вот этого немножечко тоже выбрал'],
            rightAnswer: ['ай молодец!']
        }
    }
])

function createQuestion(questions: TQuestion[]) {
    console.log(1111);
}