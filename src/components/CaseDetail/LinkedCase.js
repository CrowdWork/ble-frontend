import './CaseDetail.css'
import M from 'materialize-css'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const authHeader = {
  headers: {
  'Authorization': localStorage.token
}}

class LinkedCase extends Component {

  state = {
    caseDetail: '',
    listId: ''
  }

  componentDidMount() {
    console.log('LINKED CASE MOUNTED')
    this.fetchCase()
    const modals = document.querySelectorAll('.modal')
    for (let i = 0; i < modals.length; i++){
      M.Modal.init(modals[i])
    }
    const select = document.querySelectorAll('select')
    for (let i = 0; i < select.length; i++){
      M.FormSelect.init(select[i])
    }
    const tooltips = document.querySelectorAll('.tooltipped')
    for (let i = 0; i < tooltips.length; i++){
      M.Tooltip.init(tooltips[i])
    }
  }

  fetchCase = async () => {
    console.log('fetchCase()')
    console.log(this.props.match.params.citation)
    
    try {
      const getCase = await axios.get(`${this.props.url}/cases/linkedcase/${this.props.match.params.citation}`)
      const fetchedCase = getCase.data
      console.log(getCase)
      for (const prop in fetchedCase) {
        if (Array.isArray(fetchedCase[prop])) {
          fetchedCase[prop] = fetchedCase[prop].join().split(',')
        }
      }
      this.setState(() => ({ caseDetail: fetchedCase }))
      
    } catch (err) {
      console.log(err)
    }
  }

  renderJudges = () => {
    const { caseDetail } = this.state
    if (caseDetail) {
      return caseDetail.judges.map(judge => <li key={caseDetail.judges.indexOf(judge)}>{judge}</li>)
    }
  }

  renderKeywords = () => {
    const { caseDetail } = this.state
    if (caseDetail) {
      return caseDetail.keyWords.map(keyWord => <li key={Math.floor(Math.random() * 1000000)}>{keyWord}</li>)
    }
  }

  renderLinkedCases = () => {
    console.log("Render Linked Cases")
    const { caseDetail } = this.state
    if (caseDetail) {
      return caseDetail.linkedCasesReferredTo.map(citation => <Link key={Math.floor(Math.random() * 1000000)} to={`/linkedcase/${citation}`} target="_blank" className="col s12 m8 grey-text text-darken-3">{citation}</Link>)
    }
  }

  renderListOptions = (lists) => {
    console.log('renderListOptions()')
    console.log(lists)
    if (lists) {
      return lists.map(list => {
        return list.owner === this.props.userID._id && <option value={list._id} key={Math.floor(Math.random() * 1000000)}>{list.title}</option> 
      })
    }
  }

  addToList = async (e) => {
    console.log('Modal Form Submitted')
    e.preventDefault()
    const { caseDetail, listId } = this.state
    try {
      await axios.get(`${this.props.url}/cases/add/${caseDetail._id}/${listId}`, authHeader)
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    console.log(this.props.lists.length > 0 && this.props.lists[0].cases.includes(this.state.caseDetail._id))
    console.log('RENDER CASE DETAIL')
    return (
      <div id="CaseDetail-container">

        {/*MODAL STRUCTURE */}
        <div id="modal1" className="modal">
          <div className="modal-content">
            <h4>Adding to...</h4>
            <form onSubmit={this.addToList}>
              {/* <label>Select a list</label> */}
              <select className="browser-default" value={this.state.listId} onChange={(e) => this.setState({ listId: e.target.value })}>
                <option value="" disabled>Select a list...</option>
                {this.renderListOptions(this.props.lists)}
              </select>
              
              <button type="submit" name="action" className="modal-close btn-flat bottom right">Save</button>
            </form>
          </div>
          
        </div>
        {/*END MODAL */}

        <div id="card-panel-wrapper">
          {/* <Link to="javascript:void(0)" className="go-back" onClick={this.props.history.goBack}>Back to results</Link> */}
          <div className="flex-space-btw white">

            <div className="casedetail--casename-container">
              <h5 className="grey-text text-darken-4 casedetail-header">{this.state.caseDetail.caseName}</h5>
              {this.props.lists.length > 0 && (
                <button className="casedetail-star-btn" onClick={() => this.props.toggleFavorite(this.state.caseDetail._id)}>
                {this.props.lists[0].cases.includes(this.state.caseDetail._id) ? (
                  <i className="fas fa-star"></i>
                  ) : (
                  <i className="far fa-star"></i>
                  )
                }
              </button>
              )

              }
              
            </div>
            
            <div>
              <button data-target="modal1" className="btn tooltipped modal-trigger casedetail-add-btn" data-position="left" data-tooltip="Add this case to a list"><i className="large material-icons">playlist_add</i></button>
            </div>
          </div>
          

          <div className="card-panel casedetail-panel">
            <div className="row">
              <h6 className="col s12 m4 grey-text text-darken-3"><b>Citation</b></h6>
              <p className="col s12 m8 grey-text text-darken-3 left-align">{this.state.caseDetail.citation}</p>
            </div>
              
            
            <div className="divider grey lighten-1" />
            
              <div className="row">
                <h6 className="col s12 m4 grey-text text-darken-3"><b>Court</b></h6>
                <p className="col s12 m8 grey-text text-darken-3">{this.state.caseDetail.court}</p>
              </div>
              
            
            <div className="divider grey lighten-1" />
          
              <div className="row">
                <h6 className="col s12 m4 grey-text text-darken-3"><b>Type of Document</b></h6>
                <p className="col s12 m8 grey-text text-darken-3">{this.state.caseDetail.documentType}</p>
              </div>
              
            
            <div className="divider grey lighten-1" />
              <div className="row">
                <h6 className="col s12 m4 grey-text text-darken-3"><b>Judge(s)</b></h6>
                <p className="col s12 m8 grey-text text-darken-3">{this.renderJudges()}</p>
              </div>
            

            <div className="divider grey lighten-1" />
              <div className="row">
                <h6 className="col s12 m4 grey-text text-darken-3"><b>Keyword(s)</b></h6>
                <p className="col s12 m8 grey-text text-darken-3">{this.renderKeywords()}</p>
              </div>
            

            <div className="divider grey lighten-1" />

              <div className="row">
                <h6 className="col s12 m4 grey-text text-darken-3"><b>Summary</b></h6>
                <p className="col s12 m8 grey-text text-darken-3">{this.state.caseDetail.summary}</p>
              </div>
            
            <div className="divider grey lighten-1" />

            <div className="row">
              <h6 className="col s12 m4 grey-text text-darken-3"><b>Linked Cases Referred To</b></h6>
              <p className="col s12 m8 grey-text text-darken-3">{this.renderLinkedCases()}</p>
            </div>
            
          </div>
        </div>
      </div>
    )
  }
}

export default LinkedCase