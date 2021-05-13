import {Component} from "react";
import apiKey from './apiKey';

class ListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {word: ''}
        this.fetchDefinition();
    }

    fetchDefinition = () => {
        fetch("https://wordsapiv1.p.rapidapi.com/words/"+ this.props.word + "/definitions", {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": apiKey.key,
                "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
            }
        })
            .then(response => response.json())
            .then(response => {
                this.setState({definitions: Array.from(response.definitions)});
                // console.log(response + ", " + response.synonyms);
            })
            .catch(err => { console.log(err)
            })
    }

    render() {
        return (
            <div>
                <h1>{this.props.word}</h1>
                {this.state.definitions? this.state.definitions.map(word => <h2>{word.partOfSpeech}: {word.definition}</h2>) : ''}
            </div>
        );
    }
}

export default ListItem
