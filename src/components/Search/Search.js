import './Search.css'
import React, { Component, Fragment } from 'react'
import M from 'materialize-css'
import QueryRows from '../QueryExpressions/QueryExpressions'

const mappedFieldNames = {
  'Case Name': 'caseName',
  Citation: 'citation',
  Court: 'court',
  'Document Type': 'documentType',
  Judge: 'judges',
  Keyword: 'keyWords'
}

class Search extends Component {

  state = {
    queryStringAggregator: [],
    queryArr: [],
    rowQuery: '',
    fieldNames: ['Case Name', 'Citation', 'Court', 'Document Type', 'Judge', 'Keyword'],
    queryOps: ['includes the word(s)', 'DOES NOT include the word(s)', 'match phrase', 'DOES NOT match phrase'],
    showAdvanced: false
  }

  componentDidMount() {
    const dropdowns = document.querySelectorAll('.dropdown-trigger')
    for (let i = 0; i < dropdowns.length; i++){
      M.Dropdown.init(dropdowns[i], {
        coverTrigger: false,
        closeOnClick: false,
        alignment: 'center'
      })
    }
  }

  handleBasicFormSubmit = async (e) => {
    console.log('handleBasicFormSubmit ran')
    e.preventDefault()
    const rowInput = e.target.elements.input.value
    const fieldToSearch = e.target.elements.fieldToSearch.value
    if (!fieldToSearch === 'all') {
      const queryString = `${fieldToSearch}: ${rowInput}`
      this.props.onSearchSubmit(queryString)
    } else {
      const queryString = `cases.\*: ${rowInput}`
      this.props.onSearchSubmit(queryString)
    }    
  }

  onFormSubmit = async (e) => {
    e.preventDefault();

    if (this.state.queryStringAggregator.length > 0) {
      const logicalOperator = e.target.elements.operator.value
      const rowInput = e.target.elements.input.value
      const fieldToSearch = e.target.elements.fieldToSearch.value
      const searchCriterion = e.target.elements.searchCriterion.value
      const rowQuery = ` ${logicalOperator} (${fieldToSearch}: ${searchCriterion === 'match phrase' ? (`"${rowInput}"`) : (rowInput)})`
      
      if (rowQuery) {
        this.setState((prevState) => {
          return {
            queryStringAggregator: prevState.queryStringAggregator.concat(rowQuery)
          }
        })
        this.setState((prevState) => {
          return {
            queryArr: prevState.queryArr.concat({ 
              logicalOperator, fieldToSearch, rowInput, searchCriterion
            })
          }
        })
      };

      e.target.elements.input.value = ''
      e.target.elements.operator.value = 'OR'
      e.target.elements.fieldToSearch.value = ''
      e.target.elements.searchCriterion.value = ''

    } else {
      const rowInput = e.target.elements.input.value
      const fieldToSearch = e.target.elements.fieldToSearch.value
      const searchCriterion = e.target.elements.searchCriterion.value
      const rowQuery = `(${fieldToSearch}: ${searchCriterion === 'match phrase' ? (`"${rowInput}"`) : (rowInput)})`
      
      if (rowQuery) {
        this.setState((prevState) => {
          return {
            queryStringAggregator: prevState.queryStringAggregator.concat(rowQuery)
          }
        })
        this.setState((prevState) => {
          return {
            queryArr: prevState.queryArr.concat({
              fieldToSearch, searchCriterion, rowInput
            })
          }
           
       })
      };
      e.target.elements.input.value = ''
    }
  }

  handleSearch = () => {
    console.log('handleSearch')
    let queryString = ''
    this.state.queryStringAggregator.forEach(q => queryString += q)
    console.log(queryString)
    this.props.onSearchSubmit(queryString)
  }

  handleReset = () => {
    console.log('handleReset')
    this.setState(() => {
      return {
        rowQuery: '',
        queryStringAggregator: [],
        queryArr: []
      }
    })
  }

  renderFieldOptions = () => {
    const { fieldNames } = this.state
    return fieldNames.map(option => <option value={mappedFieldNames[option]} key={Math.floor(Math.random() * 1000000)}>{option}</option>)
  }

  renderQueryOperators = () => {
    const { queryOps } = this.state
    return queryOps.map(option => <option key={Math.floor(Math.random() * 1000000)}>{option}</option>)
  }
  
  handleToggleAdvanced = () => {
    this.setState((prevState) => {
      return {
        showAdvanced: !prevState.showAdvanced
      }
    })
  }
  

  render() {
    console.log(`queryStringAggregator: ${this.state.queryStringAggregator}`)
    return (
      <div className="dispaly-flex flex-column">
        <h1 className="center h1-search">Legal Index</h1>
        <div className="display-flex flex-column flex-justify-center flex-align-center">
          
        {!this.state.showAdvanced ? (
          <Fragment>
          <form className="border basic-form" onSubmit={this.handleBasicFormSubmit}>
            <div className="search-box-wrapper">
              <div className="input-field width-full">
                <input type="text" id="rowInput" placeholder="Search" required className="inputs" name="input" />
              </div>
              <div className="input-field">
                <select defaultValue="all" className="browser-default" name="fieldToSearch">
                  <option value="all">All</option>
                  <Fragment>
                    {this.renderFieldOptions()}
                  </Fragment>
                </select>
              </div>
              <div className="query-action-wrapper width-full">
                
                <button type="button" className="btn" onClick={this.handleReset}>Reset</button>
                <button type="submit" name="action" className="waves-light btn"><i className="material-icons">search</i></button>
              </div>
            </div>

          </form>
          <button type="button" onClick={this.handleToggleAdvanced} className="toggle-search-type">
            {this.state.showAdvanced ? 'Basic Search' : 'Advanced Search'}
          </button>
          </Fragment>
          ) : (
            <Fragment>
            <form className="advanced-form" onSubmit={this.onFormSubmit}>
            <div className="select-wrapper">
              <div className="input-field width-full">
                <input id="rowInput" placeholder="Search" required className="inputs" type="text" name="input" />
              </div>
              <div className="input-field">
                {this.state.queryStringAggregator.length > 0 && (
                <div className="query-input">
                  
                  <select name="operator" className="browser-default">
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </select>
                </div>
                )}
              </div>
              <div className="input-field">
                <div className="query-input">
                  <select className="browser-default" name="fieldToSearch">
                    <Fragment>
                      {this.renderFieldOptions()}
                    </Fragment>
                  </select>
                </div>
              </div>
              <div className="input-field">
                <div className="query-input">
                  <select className="browser-default" name="searchCriterion">
                    <Fragment>
                      {this.renderQueryOperators()}
                    </Fragment>
                  </select>
                </div>
              </div>
              <div className="query-action-wrapper width-full">
                <div>
                  <button type="button" className="btn" onClick={this.handleReset}>Reset</button>
                  <button type="submit" className="btn">Add</button>
                </div>
                <button type="submit" name="action" className="waves-light btn"><i className="material-icons">search</i></button>
              </div>
            </div>        
          </form>
          <button type="button" onClick={this.handleToggleAdvanced} className="toggle-search-type">
            {this.state.showAdvanced ? 'Basic Search' : 'Advanced Search'}
          </button>
            </Fragment>
          
          )}
        </div>
        
        <QueryRows
          {...this.state}
          renderFieldOptions={this.renderFieldOptions}
          renderQueryOperators={this.renderQueryOperators}
        />
        </div>
    )
  }
}

export default Search
