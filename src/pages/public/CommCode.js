import React, { useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import {  Grid, Paper } from '@mui/material';
import CodeClassList from './CodeClassList';
import CodeDetail from './CodeDetail';
import CodeItem from './CodeItem';
import Loading from '../spinner/Spinner';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useSelector } from "react-redux";

  export default function CommCode() {
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [codeClasses, setCodeClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [data, setData] = useState([]);
    const url = useSelector((state) => state.baseurl.url);
    const authToken = useSelector((state) => state.authToken.authToken);

    // const handleSearchTermChange = (event) => {
    //     setSearchTerm(event.target.value);
    // };
      // dialog 닫기버튼 클릭
      const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    

    // 초기화버튼 클릭
    const btnClearClickHandler = () => {
        setData([]);
        setSearchTerm('');
    };

    // list 조회버튼 클릭
    const btnSearchClickHandler = () => {
        setLoading(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
        axios.get(url+`/api/commcode/codeclass`)
        .then((response) => {
            setLoading(false);
            console.log(response.data);
            setCodeClasses(response.data.list);
        })
        .catch((error) => {
            setLoading(false);
            alert(error.response.data.detail);
            console.error('데이터 불러오기 실패:', error);
        });
    };
    // 검색 조건
    const searchContent = (
        <div style={{ padding: '0 0 10px 0' }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <Button variant="contained" color="primary" size="small" onClick={btnSearchClickHandler}>
                    찾기
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" size="small" onClick={btnClearClickHandler}>
                    초기화
                    </Button>
                </Grid>
            </Grid>
        </div>
    );


  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop:"35px" }}>
        <h2 style={{marginTop:"20px"}}>공통코드관리</h2>
        <CssBaseline />
        {searchContent}
        {loading ? <Loading/> : null}
        <Grid container spacing={2}>
            <Grid item xs={4}>
            <Paper>
                <CodeClassList codeClasses={codeClasses} onSelect={setSelectedClass} />
            </Paper>
            </Grid>
            <Grid item xs={4}>
            <Paper>
            {selectedClass ? (
                <CodeDetail codeDetail={selectedClass} onSelect={setSelectedDetail} />
            ) : (
                <CodeDetail codeDetail={null} />
            )}
            </Paper>
            </Grid>
            <Grid item xs={4}>
            <Paper>
                {selectedDetail ? (
                    <CodeItem codeItem={selectedDetail}  />
                    ) : 
                    selectedClass ? (
                        <CodeItem codeItem={selectedClass.cl_code} />
                    ) : (
                        <CodeItem codeItem={null} />
                    )
                }

            </Paper>
            </Grid>
        </Grid>
        <Dialog maxWidth="lg"  open={openDialog} onClose={handleCloseDialog}>
            {loading ? <Loading/> : null}
        </Dialog>
    </Box>
  );
}
