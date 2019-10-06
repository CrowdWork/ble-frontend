import './LegalIndex.css'
import React, { Component } from 'react'
import ListCard from '../ListCard/ListCard'
import Search from '../Search/Search'
import EsCaseList from '../EsCaseList/EsCaseList'
import M from 'materialize-css'

class LegalIndex extends Component {

  state = {
    listTitle: '',
    listPublic: false,
    noteTitle: '',
    noteBody: '',
    selectedOption: 'my-lists'
  }

  componentDidMount() {
    console.log('Legal-Index mounted')
    // const elems = document.querySelectorAll('.collapsible')
    // M.Collapsible.init(elems)
    
    const tooltips = document.querySelectorAll('.tooltipped')
    for (let i = 0; i < tooltips.length; i++){
      M.Tooltip.init(tooltips[i])
    }
    const tabs = document.querySelectorAll('.tabs')
    M.Tabs.init(tabs)
    const modals = document.querySelectorAll('.modal')
    for (let i = 0; i < modals.length; i++){
      M.Modal.init(modals[i])
    }
  }

  onPubListSelected = (e) => {
    console.log('Public selected')
    e.preventDefault()
    this.setState({ selectedOption: e.target.value })
    this.props.fetchPubLists()
  }
  onMyListSelected = (e) => {
    console.log('Public selected')
    this.setState({ selectedOption: e.target.value })
    this.props.returnMyLists()
  }

  renderLists() {
    console.log('RENDER LISTS')
    const { lists } = this.props
    if (!lists.length) return <p className="center-align">Use the button on the right to create a new list.</p>

    return lists.map(list => {
      return (
        <div className="col s12 m6 l4 xl3 list-card" key={list._id}>
          <ListCard
            listRoute={`/list/${list._id}`}
            title={list.title}
            isPublic={list.public}
          />
        </div>
      )
    })
  }

  renderNotes() {
    console.log('RENDER NOTES')
    const { notes } = this.props
    if (notes) {
      return notes.map(note => {
        return (
          <div className="col s12 m6 l4 xl3 list-card" key={note._id}>
            <ListCard
              listRoute={`/notes/${note._id}`}
              title={note.title}
              body={note.body}
            />
          </div>
        )
      })
    }
  }

  renderContent = () => {
    const { errorMessage, esSearchResults, searchAttempted, batchedSearchResults, sizeLimit, loadMoreResults, onFetchCase, onLimitChange } = this.props
    if (esSearchResults.length === 0 && !searchAttempted) {
      return errorMessage ?
        (<div>Error: {errorMessage}</div>) :
        (<div className="center">Try searching!</div>)
    }
    if (searchAttempted && !errorMessage) {
      console.log(batchedSearchResults)
      return esSearchResults.length === 0 ?
        (<div>Search did not return a match. Please try again.</div>) :
        (<EsCaseList
          esSearchResults={esSearchResults}
          batchedSearchResults={batchedSearchResults}
          sizeLimit={sizeLimit}
          loadMoreResults={loadMoreResults}
          onFetchCase={onFetchCase}
          onLimitChange={onLimitChange}
        />)
    }
    if (errorMessage) {
      return <div>Error: {errorMessage}</div>
    }

    return <div>Loading...</div>
  }
  render() {
    return (
      <div>
        {/* Tabs  */}
        <ul id="tabs-swipe-demo" className="tabs tabs-fixed-width col s12">
          <li className="tab col s4"><a href="#tab-search" className="active">Search</a></li>
          <li className="tab col s4"><a href="#tab-lists">Lists</a></li>
          <li className="tab col s4"><a href="#tab-notes">Notes</a></li>
        </ul>

        <div id="tab-search" className="col s12">
          <div className="row">
            <div className="col s12">
              <Search onSearchSubmit={this.props.onSearchSubmit} />
            </div>
          </div>
          <div className="row">
            {this.renderContent()}
          </div>
        </div>

        <div id="tab-lists" className="col s12">
            {/*LIST MODAL STRUCTURE */}
            <div id="modal1" className="modal">
              <div className="modal-content">
                <h4>New list...</h4>
                <form onSubmit={this.onListFormSubmit}>
                  <div className="row">
                    <div className="input-field col s12">
                      <input value={this.state.listTitle} id="listTitle" type="text" onChange={(e) => this.setState({ listTitle: e.target.value })} />
                      <label htmlFor="listTitle">List Title</label>
                    </div>
                  </div>
                  <select className="browser-default" value={this.state.listPublic} onChange={(e) => this.setState({ listPublic: e.target.value })}>
                    <option value={false}>Private (default)</option>
                    <option value={true}>Public</option>
                  </select>
                  <button type="submit" name="action" className="modal-close btn-flat right">Save</button>
                </form>
              </div>
            </div>
            {/*END LIST MODAL */}
            <div className="row valign-wrapper">
              <div className="col s12 margin-left-10875">
                <h5>Lists</h5>
                <p>View and manage your lists.</p>
              </div>
              
            </div>
            <div className="row">
              <div className="buttons-flex margin-left-10875">
                <form>
                  <p className="margin-right-16">
                    <label>
                      <input name="group1" value="my-lists" type="radio" checked={this.state.selectedOption === "my-lists"} onChange={this.onMyListSelected} />
                        <span>My Lists</span>
                    </label>
                  </p>
                  <p>
                    <label>
                      <input name="group1" value='public-lists' checked={this.state.selectedOption === "public-lists"} onChange={this.onPubListSelected} type="radio" />
                      <span>Public</span>
                    </label>
                  </p>
                </form>
                <div className="buttons-flex">
                  <a href="javascript:void(0)" data-target="modal1" className="btn-floating tooltipped btn-large modal-trigger margin-right-10875 Lists--buttons" data-position="right" data-tooltip="Create a new list."><i className="margin-0 large material-icons">playlist_add</i>Add New List</a>
                </div>
              </div>
              {this.renderLists()}
            </div>
          </div>

          <div id="tab-notes" className="col s12">
            {/*NOTES MODAL STRUCTURE */}
            <div id="modalNote" className="modal">
              <div className="modal-content">
                <h4>New note...</h4>
                <form className="col s12" onSubmit={this.onNoteFormSubmit}>
                  <div className="row">
                    <div className="input-field col s12">
                      <input id="title" placeholder="Title..." value={this.state.noteTitle} type="text" onChange={(e) => this.setState({ noteTitle: e.target.value })}/>
                    </div>
                    <div className="input-field col s12">
                      <textarea id="body" placeholder="Take a note..." className="materialize-textarea" value={this.state.noteBody} onChange={(e) => this.setState({ noteBody: e.target.value })}></textarea>
                    </div>
                  </div>
                  <button type="submit" name="action" className="modal-close btn-flat right">Save Note</button>
                </form>
              </div>
            </div>
            {/*END NOTES MODAL */}
            <div className="row valign-wrapper">
              <div id="note-section-title"className="col s10">
                <h5>Notes</h5>
                <p>Manage your notes.</p>
              </div>
              <div className="col s2">
                <a href="javascript:void(0)" data-target="modalNote" className="btn-flat modal-trigger tooltipped" data-position="left" data-tooltip="Add new note."><i id="button-addnote" className="large material-icons">note_add</i></a>
              </div>
            </div>
            <div className="row">
              {this.renderNotes()}
            </div>
          </div>
        
      </div>
    )
  }
    
}

export default LegalIndex
