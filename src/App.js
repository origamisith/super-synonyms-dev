import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Col, Form, Button, Row } from 'react-bootstrap';
import {Component} from "react";
import apiKey from './apiKey';
import ListItem from "./ListItem";
import Loader from "react-spinners/PacmanLoader"
import RangeSlider from 'react-bootstrap-range-slider'

document.body.style = 'background: #d7ffd9'
class App extends Component {
    state = {
        word: '',
        loading: false,
        maxChars: 30,
    };

    handleSubmitWord = (e) => {
        this.setState({loading: true }, () => {
            this.setState({results: 0})
            e.preventDefault();

            if (!this.state.word) {
                this.setState({loading: false, failed: true})
                return;
            }

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
                        loading: false,
                        failed: !response.synonyms || response.synonyms.length === 0,
                        synonyms: response.synonyms ? Array.from(response.synonyms) : '',
                        results: response.synonyms? response.synonyms.length : ''
                    });
                    console.log(response);
                })
                .catch(err => {
                    console.log(err)
                });
        });
        this.setState({loading: false})
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
                        <Form class="justify-content-center" as={Row} className = "Form">
                            <Col sm = {12} lg={5} className = "enter">
                                <Form.Control placeholder="Enter a word" variant="primary" type="text" name="word" onChange = {this.handleWordChange}/>
                            </Col>
                            <Col sm = {12} lg={1}  className = "search">
                                <Button block variant = "primary" type="submit" ><i className="fa fa-search" aria-hidden="true"/>
                                </Button>
                            </Col>
                            <Col lg={3} className = "sliderTitle">
                                Maximum Word Length
                            </Col>
                            <Col md={3} className = "slider">
                                <RangeSlider value = {this.state.maxChars} tooltip='on' min = '2' max = '30'
                                             onChange = {e => this.setState(
                                                 {maxChars: e.target.value,
                                                     results: this.state.synonyms? this.state.synonyms.filter(word => word.length <= e.target.value).length : ''}

                                             )}/>
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
                        {(this.state.synonyms && !this.state.failed) ? this.state.synonyms
                            .filter(word => word.length <= this.state.maxChars)
                            .map((synonym) => <ListItem className = "item" key = {synonym} word = {synonym}/>) : ''}
                        {this.state.failed === true ? <h3>No synonyms found</h3> : ''}
                    </Row>
                </Container>
            </div>
        );
    }
}

export default App;
