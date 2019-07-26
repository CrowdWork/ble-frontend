import './CaseList.css'
import React from 'react'
import { Link } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import Preloader from '../Preloader/Preloader'


const CaseList = ({ batchedSearchResults, esSearchResults, loadMoreResults }) => {
  const caseList = batchedSearchResults.map(thisCase => {
    // each._source.caseName.replace(/^\s+/g, '')
      console.log(thisCase._source.mongo_id)
      return (
        <li className="col s12 card-wrapper" key={thisCase._id}>
          <div className="card horizontal">
            <div className="card-stacked">
              <div className="card-content">
                <div>
                  <h6 className="header"><strong>{thisCase._source.caseName.length > 40 ? (thisCase._source.caseName.substring(0, 40) + '...') : (thisCase._source.caseName)}</strong></h6>
                  <p>{thisCase._source.citation}</p>
                </div>
                <div className="court-year">
                  <p>{thisCase._source.court}</p>
                  <p>{thisCase._source.year}</p>
                </div>
              </div>
              <div className="card-action">
                <Link to={`/${thisCase._source.mongo_id}`} className="left">Detail</Link>
              </div>
            </div>
          </div>
        </li>
      )
    })
    console.log('Batched Results: ' + batchedSearchResults.length)
    console.log('Case List: ' + caseList.length)
  return (
    <div className="caselist-wrapper">
      <div className="list-utils">
        <h6 className="result-header header">Showing 1 to {caseList.length} of {esSearchResults.length} {caseList.length > 1 ? ('Results') : ('Result')}</h6>
        
      </div>
      <div>
        <InfiniteScroll
          dataLength={batchedSearchResults.length}
          next={loadMoreResults}
          hasMore={caseList.length < esSearchResults.length}
          scrollThreshold={1}
          loader={<Preloader />}
          endMessage={
            <p style={{textAlign: 'center'}}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          <ul>
            {caseList}
          </ul>
        </InfiniteScroll>
      </div>
      
    </div>
  )
}

export default CaseList