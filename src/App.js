// import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Col, Form, Button, Row } from 'react-bootstrap';
import {Component} from "react";
import apiKey from './apiKey';
import ListItem from "./ListItem";
import Loader from "react-spinners/PacmanLoader"
import RangeSlider from 'react-bootstrap-range-slider'
import { css } from "@emotion/core"
// const override = css`
//     display: block
//     margin: 0 auto;
//     border-color: red;
// `;

class App extends Component {
    state = {
        word: '',
        loading: false,
        maxChars: 15,
    };

    handleSubmitWord = (e) => {
        this.setState({loading: true }, () => {
            e.preventDefault();

            if (!this.state.word) return;

            // read all entities
            fetch("https://wordsapiv1.p.rapidapi.com/words/" + this.state.word + "/synonyms", {
                "method": "GET",
                "headers": {
                    "x-rapidapi-key": apiKey.key,
                    "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
                }
            })
                .then(response => response.json())
                .then(response => {
                    this.setState({
                        failed: !response.synonyms,
                        synonyms: response.synonyms ? Array.from(response.synonyms) : '',
                        loading: false,
                        results: response.synonyms.length
                    });
                    console.log(response);
                })
                .catch(err => {
                    console.log(err)
                });
        });
    }

    handleWordChange = (e) => {
        this.setState({word: e.target.value});

    }

    render() {
        return (
            <div className="App">
                <Container className="firstrow" fluid >
                    <Row className = "nav">
                        <Col className="navbar-text"> Super Synonyms</Col>
                    </Row>
                </Container>

                <Container className = "secondrow">
                    <form onSubmit={this.handleSubmitWord}>
                        <Form class="justify-content-center" as={Row} className = "Form" onSubmit={this.handleSubmitWord}>
                            <Col xs={6} className = "enter">
                                <Form.Control placeholder="Enter a word" variant="primary" type="text" name="word" onChange = {this.handleWordChange}/>
                            </Col>
                            <Col xs={1} class="text-left">
                                <Button variant = "primary" type="submit" ><i className="fa fa-search" aria-hidden="true"/>
                                </Button>
                            </Col>
                            <Col lg={5} className = "slider">
                                <Row className = "sliderTitle">
                                Maximum Word Length
                                </Row>
                                <Row>
                                <RangeSlider value = {this.state.maxChars} tooltip='on' min = '2' max = '20'
                                             onChange = {e => this.setState(
                                                 {maxChars: e.target.value,
                                                     results: this.state.synonyms.filter(word => word.length <= e.target.value).length}
                                             )}/>
                                </Row>
                            </Col>
                        </Form>
                    </form>
                    <Row className="results">
                        {this.state.results? "Showing " + this.state.results + " results": ""}
                    </Row>
                </Container>
                <Container>
                    <Row>
                        <Loader loading = {this.state.loading}/>
                        {this.state.synonyms? this.state.synonyms
                            .filter(word => word.length <= this.state.maxChars)
                            .map((synonym) => <ListItem key = {synonym} word = {synonym}/>) : ''}
                        {this.state.failed === true ? <h1>No synonyms found</h1> : ''}
                    </Row>
                </Container>
            </div>
        );
    }
}

export default App;
