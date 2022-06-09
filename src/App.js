import React, { useEffect, useState } from 'react';
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
  { id: 'statusCircle', label: 'Status', minWidth: 50 },
  { id: 'addedAt', label: 'AddedAt', minWidth: 100 },
  { id: 'email', label: 'Email', minWidth: 170 },
  { id: 'name', label: 'Name', minWidth: 100 },
  { id: 'riskSecurityScore', label: 'Risk Score', minWidth: 170 },
  { id: 'warrantyVerification', label: 'Warranty Verification', minWidth: 100 },
  { id: 'statusemail', label: 'Status', minWidth: 170 },
  { id: 'pushretries', label: 'Push Retries', minWidth: 100 },
  { id: 'addTaskButton', label: 'Add to dashboard', minWidth: 50 },
];





export default function StickyHeadTable() {
  const [error, setError] = useState(null);
  const [email, setEmail] = React.useState();
  const classes = useStyles();
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [value, setValue] = useState();
  let id;
  let columnId;
  let groupId;
  let itemId;
  let url = "https://akitacloud-public-api.azurewebsites.net/api/public/enterprises/employees-list?email=" + email;
  
  monday.api(`query { me { email } }`).then(res => {
    setEmail(res.data.me.email);
  });

  function createData(status, addedAt, email,name, securityScore, riskScore, warrantyVerification,statusemail ,pushretries,valid) {
    let addTaskButton=  <button onClick={() => createBoard(status, addedAt, email,name, securityScore, riskScore, warrantyVerification,statusemail ,pushretries,valid)} style={{height:"20px", width:"40px", border:'none',borderRadius:"10px", backgroundColor:"#afecb1" ,display:valid? "none" : "unset",}}>Open task</button>  
    
    let statusCircle = <div style={{height:"20px", width:"20px", borderRadius:"100%", backgroundColor: status? "#36c6d3": "#ed6870"}}></div>
    let x = Math.round(securityScore)
    let riskSecurityScore = <div style={{display:"flex"}}><div style={{marginRight:"10px", height:"20px", width:"30px", textAlign:"center", color:"white", borderRadius:"8px", backgroundColor:"red"}}>{x}</div><div>{riskScore}</div></div>
    return { statusCircle, addedAt, email,name, riskSecurityScore, warrantyVerification,statusemail ,pushretries, addTaskButton};
}


  async function createBoard(status, addedAt, email,name, riskScore, warrantyVerification,statusemail ,pushretries) {

  await monday.api(`mutation { create_board (board_name:"AKITA Zero-Trust", board_kind: public) { id }}`).then(res => {
      id = res.data.create_board.id
    })

      if(id){    
        await monday.api(`mutation { create_group (board_id: ${id}, group_name: "AKITA Zero-Trust") { id } }`).then(res => {
          groupId = res.data.create_group.id
        });

        await monday.api(`mutation { create_item (board_id:  ${id}, group_id:  ${groupId}, item_name: "AKITA Zero-Trust Task") { id }}`).then(res => {
          itemId = res.data.create_item.id
        });
        let params = [
          {title:"Status", value:!!status},
          {title:"AddedAt", value:addedAt},
          {title:"Email", value:email},
          {title:"Name", value:name},
          {title:"Risk Score", value:riskScore},
          {title:"Warranty Verification", value:warrantyVerification},
          {title:"Status email", value:!!statusemail},
          {title:"Push retries", value:pushretries},
        ]
        for (let i = 0; i < params.length; i++) {
          await  monday.api(`mutation { create_column (board_id:${id}, title:"${params[i].title}", column_type:text){id}}`).then(res => {
            columnId = res.data.create_column.id;
          }); 
          await monday.api(`mutation {change_simple_column_value (board_id: ${id}, item_id: ${itemId}, column_id: ${columnId}, value:"${params[i].value}") {id}}`).then(res => {});
        }
      }
  }

function createRow(data = []){
  return data.map(i => createData(
    i.Status,
    i.AddedAt,
    i.Email,
    i.Name,
    i.SecurityScore,
    i.SecurityScoreUpdatedAt,
    i.DebugModeDate,
    i.Status,
    i.PushLastSentAt,
    i.Valid
  ));
}

useEffect(() => {
  fetch(url)
    .then(res => res.json())
    .then(
      (result) => {
        setIsLoaded(true);
        setValue(result);
      },
      (error) => {
        setIsLoaded(true);
      }
    )
}, [url])

 if (error) {
    return <div>Ошибка: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Загрузка...</div>;
  } else {
  return (
    <Paper className={classes.root}>
    {!isLoaded && (<p>loading...</p>)}
    {isLoaded && (
      <TableContainer className={classes.container}>
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
            {createRow(value).map((row) => {
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
  )}
  ;
}

