import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
const axios = require('axios');

let rows = [];
const monday = mondaySdk();

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: '100vh',
  },
});

const columns = [
  { id: 'status', label: 'Status', minWidth: 50 },
  { id: 'addedAt', label: 'AddedAt', minWidth: 100 },
  { id: 'email', label: 'Email', minWidth: 170 },
  { id: 'name', label: 'Name', minWidth: 100 },
  { id: 'riskScore', label: 'Risk Score', minWidth: 170 },
  { id: 'warrantyVerification', label: 'Warranty Verification', minWidth: 100 },
  { id: 'statusemail', label: 'Status', minWidth: 170 },
  { id: 'pushretries', label: 'Push Retries', minWidth: 100 },
];



function createData(status, addedAt, email,name, securityScore, riskScore, warrantyVerification,statusemail ,pushretries) {
    status = <div style={{height:"20px", width:"20px", borderRadius:"100%", backgroundColor: status? "#36c6d3": "#ed6870"}}></div>
    let x = Math.round(securityScore)
    riskScore = <div style={{display:"flex"}}><div style={{marginRight:"10px", width:"30px", textAlign:"center", color:"white", borderRadius:"8px", backgroundColor:"red"}}>{x}</div><div>{riskScore}</div></div>
    return { status, addedAt, email,name, riskScore, warrantyVerification,statusemail ,pushretries};
}




function createRow(data){
  for(let i=0;i<data.length; i++){
    console.log(data[i].Status);
  // rows =  createData(
  //     data[i].Status,
  //     data[i].AddedAt,
  //     data[i].Email,
  //     data[i].Name,
  //     data[i].SecurityScore,
  //     data[i].SecurityScoreUpdatedAt,
  //     data[i].DebugModeDate,
  //     data[i].Status,
  //     data[i].PushLastSentAt,
  //   );
  }
}

export default function StickyHeadTable() {

  const [email, setEmail] = React.useState();
  const classes = useStyles();
  const [isLoaded, setIsLoaded] = React.useState(false);
  let url = "https://akitacloud-public-api.azurewebsites.net/api/public/enterprises/employees-list?email=" + email;

  monday.api(`query { me { email } }`).then(res => {
    setEmail(res.data.me.email);
    console.log(res.data.me.email);
  });

  useEffect(() => {
    axios.get(url, {
      mode: 'no-cors',
      })
      .then(function (response) {
        createRow(response.data)
        console.log(rows);
        setIsLoaded(true);
        return response;
      })
      .catch(function (error) {
        setIsLoaded(false);
        console.log(error);
      })
      .then(function () {
      });  
    
  })

  return (
    <Paper className={classes.root}>
    {!isLoaded && (<p>loading...</p>)}
    {isLoaded && (
      <TableContainer className={classes.container}>
        {email}
        <Table stickyHeader aria-label="  table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
          )}
    </Paper>
  );
}

