// import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button } from 'react-bootstrap';
import {Component} from "react";
import apiKey from './apiKey';
import ListItem from "./ListItem";

class App extends Component {
    state = {
        word: ''
    };

    handleSubmitWord = (e) => {
        e.preventDefault();

        console.log(e.target.value);
        if(!this.state.word) return;

        // read all entities
        fetch("https://wordsapiv1.p.rapidapi.com/words/"+ this.state.word + "/synonyms", {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": apiKey.key,
                "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
            }
        })
            .then(response => response.json())
            .then(response => {
                this.setState({failed: !response.synonyms})
                this.setState({synonyms: response.synonyms ? Array.from(response.synonyms) : ''})
                // console.log(response + ", " + response.synonyms);
            })
            .catch(err => { console.log(err)
            });
    }

    handleWordChange = (e) => {
        this.setState({word: e.target.value});

    }

    render() {
        return (
            <div className="App">
                <div className = "nav">
                    <h1>Superb Synonyms</h1>
                </div>
                <Form onSubmit={this.handleSubmitWord}>
                    <Form.Label>
                        Word:
                        <Form.Control variant="primary" type="text" name="word" onChange = {this.handleWordChange}/>
                    </Form.Label>
                    <Button variant = "primary" type="submit" value="Submit" />
                </Form>
                {this.state.synonyms? this.state.synonyms.map((synonym) => <ListItem word = {synonym}/>) : ''}
                {this.state.failed === true ? <h1>k No synonyms found</h1> : ''}
            </div>
        );
    }
}

export default App;
