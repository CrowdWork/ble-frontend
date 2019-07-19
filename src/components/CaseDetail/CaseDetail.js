import './CaseDetail.css'
import M from 'materialize-css'
import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const url = "http://localhost:4000"
// const url = "https://ble-backend.herokuapp.com"

class CaseDetail extends Component {
  state = {
    courtCase: '',
    isFavorite: false
  }

  componentDidMount() {
    console.log('componentDidMount')
    return this.fetchCase()
   
  }
  // componentDidUpdate(prevProps, prevState) {
  //   console.log('componentDidUpdate')
  //   console.log(prevState === this.state)
  //   if (prevState.isFavorite !== this.state.isFavorite) {
  //     return this.fetchCase()
  //   }
  // }

  fetchCase = async () => {
    try {
      const getCase = await axios.get(`${url}/cases/detail/${this.props.match.params.mongo_id}`)
      const fetchedCase = getCase.data[0]
      for (const prop in fetchedCase) {
        if (Array.isArray(fetchedCase[prop])) {
          fetchedCase[prop] = fetchedCase[prop].join().split(',')
        }
      }
      console.log(fetchedCase)
      this.setState({ 
        courtCase: fetchedCase,
        isFavorite: fetchedCase.favorite
      })
    } catch (err) {
      console.log(err)
    }
  }
  
  onToggleFavorite = async () => {
    if (this.state.isFavorite === true) {
      this.setState({ isFavorite: false })
      M.toast({html: 'Case removed from your favorites!'})
      try {
        const updateCase = await axios.patch(`${url}/cases/detail/${this.props.match.params.mongo_id}`, {
          favorite: false
        })
        if (updateCase) this.fetchCase()
      } catch (err) {
        console.log(err)
      }
      
    } else {
        this.setState({ isFavorite: true })
        M.toast({html: 'Case saved to your favorites!'})
        try {
          await axios.patch(`${url}/cases/detail/${this.props.match.params.mongo_id}`, {
            favorite: true
          })
        } catch (err) {
          console.log(err)
        }
      }
    }

    renderJudges() {
      const { courtCase } = this.state
      if (courtCase) {
        return courtCase.judges.map(judge => <li key={courtCase.judges.indexOf(judge)}>{judge}</li>)
      }
    }

    renderKeywords() {
      const { courtCase } = this.state
      if (courtCase) {
        return courtCase.keyWords.map(keyWord => <li key={courtCase.keyWords.indexOf(keyWord)}>{keyWord}</li>)
      }
    }

  render() {
    console.log(this.state.isFavorite)
    // console.log(`FAVORITE: ${this.state.courtCase.judges[0]}`)
    return (
      <div id="CaseDetail-container" className="row">
        <div id="card-panel-wrapper" className="col s12 m5">
          <a className="btn" onClick={this.props.history.goBack}><i id="navBack" className="material-icons">arrow_back</i> Back to results</a>
          
          <div className="flex-space-btw">
            <h4>Case Details</h4>
            <i id="favorite-icon" className="material-icons" onClick={this.onToggleFavorite}>{this.state.isFavorite ? 'favorite' : 'favorite_border'}</i>
          </div>
            
          <div className="card-panel white">
            
            <h5>{this.state.courtCase.caseName}</h5>
            <table className="bordered">
              <tbody>
                <tr>
                  <th>Citation</th>
                  <td>{this.state.courtCase.citation}</td>
                </tr>
                <tr>
                  <th>Court</th>
                  <td>{this.state.courtCase.court}</td>
                </tr>
                <tr>
                  <th>Type of Document</th>
                  <td>{this.state.courtCase.documentType}</td>
                </tr>
                <tr>
                  <th>Judge(s)</th>
                  <td>{this.renderJudges()}</td>
                </tr>
                <tr>
                  <th>Keyword(s)</th>
                  <td>{this.renderKeywords()}</td>
                </tr>
                <tr>
                  <th>Summary</th>
                  <td>{this.state.courtCase.summary}</td>
                </tr>
                <tr>
                  <th>Cases Referred To</th>
                  <td>Coming Soon!</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
  
}

export default CaseDetail
