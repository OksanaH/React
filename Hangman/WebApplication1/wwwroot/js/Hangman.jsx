
class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {};       
        this.submitGuess = this.submitGuess.bind(this);
        this.getWord();
    }

    submitGuess(guess) { 
            if (this.state.usedLetters.indexOf(guess) > -1)
                this.setState({ message: "You have already used this letter" })
            else {
                var used = this.state.usedLetters.concat(guess)
                this.setState({ usedLetters: used });
                if (this.state.origWord == guess) {
                    this.setState({ message: "You have WON !!! You have guessed the word in " + (5 - this.state.triesLeft)+ " tries", });

                }
                else {
                    if (this.state.origWord.indexOf(guess) > -1) {
                        this.setState({ message: "Well done", });
                        this.displayWord(used);
                    }
                    else {
                        this.setState({ message: "No letter " + guess })
                    }
                }
        }
        if (this.state.triesLeft-1 == 0) {
            this.setState({ message: "You have LOST!!!" })
        }
        this.setState(
            {
                triesLeft: this.state.triesLeft - 1,
                triesLeftMessage: "You have " + (this.state.triesLeft - 1).toString() + " tries left"
            })
        this.setState({ currentGuess: '' });  
    }   

    componentDidMount() {
        this.setState({
            message: "Welcome! I have guessed a word",
            triesLeft: 5,
            triesLeftMessage: 'You have 5 tries to guess it',
            origWord: '',
            toDisplay: '',
            usedLetters: '',
            currentGuess: '',
            totalTimeTaken:0
        });
    }
    getWord() {        
        const xhr = new XMLHttpRequest();
        xhr.open('get', "/word", true);
        xhr.onload = () => {
            this.setState({ origWord: JSON.parse(xhr.responseText) })
            this.setState({ toDisplay: this.state.origWord.replace(/./gm, '_ ') })
        };
        xhr.send();
    }
    displayWord(used) {           
            this.setState({ toDisplay: this.state.origWord.replace(new RegExp("[^" + used + "]", 'g'), '_ ') });     
    } 
    render() {
        return (
            <div id="parent" >
                <MessageBox origWord={this.state.origWord}
                toDisplay={this.state.toDisplay}
                    message={this.state.message}
                    triesLeft={this.state.triesLeft}
                    triesLeftMessage={this.state.triesLeftMessage}>
                </MessageBox>
                <br /><br />
                <GuessForm triesLeft={this.state.triesLeft} onSubmitGuess={this.submitGuess}></GuessForm>
                <br /><br />
                
                <Clock triesLeft={this.state.triesLeft}></Clock>
             </div>
     )        
    }

}

class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.timer = 0;
        this.state = { mins: 0, secs: 0 };
       
        this.startTimer = this.startTimer.bind(this);
        this.start = this.start.bind(this);
    }
    componentDidMount() {
        this.setState({ time: this.secondsToTime(this.state.secs)});
        this.startTimer();
    }
    secondsToTime(secs) {   
        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);

        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);

        let obj = {
            "mins": minutes,
            "secs": seconds
        };
        return obj;
    }
    startTimer() {
        if (this.timer == 0 && this.state.secs == 0) {
            this.timer = setInterval(this.start, 1000);
        }
    }
    start() {
        var secs = this.state.secs + 1;
        var time = this.secondsToTime(secs);
        this.setState({ mins: (this.state.mins+ time["mins"]), secs: time["secs"] })

        if (this.props.triesLeft == 0) {
            clearInterval(this.timer);
            var total = "You have taken "+this.state.mins+" min "+this.state.secs+ " sec";
            this.setState({ timeTakenMessage: total});
        }
    }
    render() {
        return (
            <div>
                <h2>TIMER</h2>
                mins: {this.state.mins} secs: {this.state.secs}
                <br /><br/>
                <b>{this.state.timeTakenMessage}</b>
            </div>
        );
    }
}
class MessageBox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="messageBox">
            <h1>This is a test</h1>
                {this.props.message}<br /><br />
                {this.props.toDisplay}<br /><br />
                {this.props.triesLeftMessage}                
            </div>
        );
    }
}/*end message box*/

class GuessForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { currentGuess: '' };      
        //bind to the parent element
        this.submit = this.submit.bind(this);
      
    }
    processGuess = (e) => {    
      this.setState({ currentGuess: e.target.value });  
    }
    submit(e) {
        e.preventDefault();
        if (this.props.triesLeft > 0) {
            this.props.onSubmitGuess(this.state.currentGuess);
            this.setState({ currentGuess: '' });
        }
       
    }   
    
    render() {       
        return (
            <form className="guessForm" onSubmit={this.submit}  >
                <input type="text" placeholder="Your guess-letter or word" value={this.state.currentGuess} onChange={this.processGuess}  />               
                <input type="submit" value="post" />
            </form>)
    }
}

//instantiate root component

ReactDOM.render(
    <Game></Game>,
    document.getElementById('content')
);