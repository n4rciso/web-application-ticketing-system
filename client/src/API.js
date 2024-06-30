import dayjs from 'dayjs';

const SERVER_URL = 'http://localhost:3001/api/';

/**
 * A utility function for parsing the HTTP response.
 */
function getJson(httpResponsePromise) {
    // server API always return JSON, in case of error the format is the following { error: <message> } 
    return new Promise((resolve, reject) => {
      httpResponsePromise
        .then((response) => {
          if (response.ok) {
  
           // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
           response.json()
              .then( json => resolve(json) )
              .catch( err => reject({ error: "Cannot parse server response" }))
  
          } else {
            // analyzing the cause of error
            response.json()
              .then(obj => 
                reject(obj)
                ) // error msg in the response body
              .catch(err => reject({ error: "Cannot parse server response" })) // something else
          }
        })
        .catch(err => 
          reject({ error: "Cannot communicate"  })
        ) // connection error
    });
  }



  /**
 * Getting from the server side and returning the list of tickets (no description).
 */
const getTickets = async () => {
    // film.watchDate could be null or a string in the format YYYY-MM-DD
    return getJson(fetch(SERVER_URL + 'tickets', { credentials: 'include' }))
    .then( json => {
      return json.map((ticket) => {
        const clientTicket = {
            id: ticket.id,
            title: ticket.title,
            state: ticket.state,
            category: ticket.category,
            ownerId: ticket.ownerId,
            timestamp: ticket.timestamp,
            ownerUsername: ticket.owner,
        }
        return clientTicket;
      })
    })
  }

  /**
 * Getting from the server side and returning the list of tickets (no description).
 */
  const getTicketDetails = async (ticketId) => {
    // film.watchDate could be null or a string in the format YYYY-MM-DD
    return getJson(fetch(SERVER_URL + 'tickets/' + ticketId, { credentials: 'include' }))
    .then( json => {
      return json.map((ticket) => {
        const ticketsDetails = {
            content: ticket.content,
            author: ticket.author,
            timestamp: ticket.timestamp,
        }
        return ticketsDetails;
      })
    })
  }

/**
 * This function adds a new ticket in the back-end library.
 */
function addTicket(ticket) {
  return getJson(
    fetch(SERVER_URL + "tickets/", {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticket) 
    })
  )
}

/**
 * This function adds a new response to the ticket.
 */
function answerATicket(answer) {

  return getJson(
    fetch(SERVER_URL + "tickets/" + answer.ticketId + "/answer", {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(answer) 
    })
  )
}

/*
 * This function usings the API update the ticket state
  */
function updateStateTicket(ticket) {
  return getJson(
    fetch(SERVER_URL + "tickets/" + ticket.id + "/state" , {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticket) 
    })
  )
}

/*
 * This function usings the API update the ticket category
  */
function updateCategoryTicket(ticket) {
  return getJson(
    fetch(SERVER_URL + "tickets/" + ticket.id + "/category" , {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticket) 
    })
  )
}


/*** Authentication functions ***/

/**
 * This function wants username and password inside a "credentials" object.
 * It executes the log-in.
 */
const logIn = async (credentials) => {
  return getJson(fetch(SERVER_URL + 'sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',  // this parameter specifies that authentication cookie must be forwared
    body: JSON.stringify(credentials),
  })
  )
};

/**
 * This function is used to verify if the user is still logged-in.
 * It returns a JSON object with the user info.
 */
const getUserInfo = async () => {
  return getJson(fetch(SERVER_URL + 'sessions/current', {
    // this parameter specifies that authentication cookie must be forwared
    credentials: 'include'
  })
  )
};

/**
 * This function destroy the current user's session and execute the log-out.
 */
const logOut = async() => {
  return getJson(fetch(SERVER_URL + 'sessions/current', {
    method: 'DELETE',
    credentials: 'include'  // this parameter specifies that authentication cookie must be forwared
  })
  )
}


/*** Token ***/
async function getAuthToken() {
  return getJson(fetch(SERVER_URL + 'auth-token', {
    // this parameter specifies that authentication cookie must be forwared
    credentials: 'include'
  })
  )
}

async function getEstimation(authToken, ticket) {
  //console.log("getEstimation: sta richiedendo un estimation con token:",authToken);
  // retrieve info from an external server, where info can be accessible only via JWT token
  return getJson(fetch('http://localhost:3002/api/' + 'ticket/estimation', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({title: ticket.title, category: ticket.category}),
  })
  );
}

const API = { getTickets,getTicketDetails,addTicket,answerATicket,updateStateTicket, updateCategoryTicket,logIn,getUserInfo,logOut,getAuthToken,getEstimation};
export default API;