import './ListItem.css';
import {Component} from "react";
import apiKey from './apiKey';
import {Container, Col, Form, Button, Row } from 'react-bootstrap';
import Loader from "react-spinners/PacmanLoader"

class ListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            word: '',
            loading: false
        }
    }
    componentDidMount() {
        this.fetchDefinition()
    }

    fetchDefinition = () => {
        this.setState({loading: true}, ()=>{
        fetch("https://wordsapiv1.p.rapidapi.com/words/" + this.props.word + "/definitions", {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": apiKey.key,
                "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
            }
        })
            .then(response => response.json())
            .then(response => {
                this.setState({
                    definitions: Array.from(response.definitions),
                    loading: false
                });
                console.log(this.state.definitions + " are the definitions");
            })
            .catch(err => {
                console.log(err);
            });
        });
    }

    render() {
        return (
            <div>
                <Container className = "Item">
                    <h2 className="Header">{this.props.word}</h2>
                    <Loader loading = {this.state.loading}/>
                    {this.state.definitions? this.state.definitions.map(word => <h4>{word.partOfSpeech}: {word.definition}</h4>) : ''}
                </Container>
            </div>
        );
    }
}

export default ListItem
