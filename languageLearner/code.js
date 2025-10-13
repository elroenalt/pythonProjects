const language = [
    {
        word: ['at','there']
    }
]
console.log(language[0].word)
class QuestionScreen {
    constructor() {
        this.options = [
            {
                radio: document.querySelector('#choice0'),
                label: document.querySelector('label[for="choice0"]')
            },
            {
                radio: document.querySelector('#choice1'),
                label: document.querySelector('label[for="choice1"]')
            },
            {
                radio: document.querySelector('#choice2'),
                label: document.querySelector('label[for="choice2"]')
            }
        ]
        this.instruction = document.querySelector('#instruction');
        this.question = document.querySelector('#question');
        this.nextAction = document.querySelector('#nextAction');
        this.nextAction.addEventListener('click', () => this.checkIfCorrect())
        this.corOption
    }
    displayQuestions(corOption = 0, options = [['at','that'],['apthr','again'],['eigi',"dont't"]], dir = 0) {
        this.corOption = corOption
        this.question.textContent = options[corOption][ dir ? 1 : 0 ]
        dir = dir ? 0 : 1
        for(let i = 0; i < 3; i++) {
            this.options[i].label.textContent = options[i][dir]
        }
    }
    getCheckedOption() {
        for(let i = 0; i < 3; i++) {
            if(this.options.radio.checked) return i
        }
    }
    checkIfCorrect() {
        const checked = this.getCheckedOption()
        if(checked == this.corOption) {
            this.options[checked].label.classList.add('red')
        }
    }
}
const questionScreen = new QuestionScreen()
questionScreen.displayQuestions()