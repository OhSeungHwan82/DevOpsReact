import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import { useSelector } from "react-redux";
import {
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel
  } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// const url = localStorage.getItem("url");
// const authToken = localStorage.getItem("authToken");
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export default function Revive() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedOption, setSelectedOption] = React.useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [detailData, setDetailData] = useState([]);
    const [data, setData] = useState([]); // list data
    const [detailListdata01, setDetailListData01] = useState([]); // detail list data
    const [detailListdata02, setDetailListData02] = useState([]); // detail list data
    const [dsCombo01, setCombo01] = useState([]);
    const url = useSelector((state) => state.baseurl.url);
    const authToken = useSelector((state) => state.authToken.authToken);

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'jubsu_no', headerName: '접수번호', width: 150, editable: false},
        { field: 'title', headerName: '제목', width: 500, editable: false},
        { field: 'status_nm', headerName: '상태', width: 150, editable: false},
        { field: 'create_date', headerName: '생성일자', sortable: false, width: 160},
        // 관리버튼 추가
        {
            field: 'manage',
            headerName: 'Manage',
            width: 120,
            renderCell: (params) => (
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleManageButtonClick(params.row)}
                size="small"
            >
                관리
            </Button>
            ),
        },
    ];

    const detailColumns01 = [
        { field: 'column_value', headerName: '컬럼', width: 120, editable: false},
        { field: 'before_value', headerName: '변경전', width: 120, editable: false},
        { field: 'after_value', headerName: '변경후', width: 120, editable: false},
        { field: 'forecast_sql', headerName: '작업SQL', width: 550, sortable: false},
        { field: 'status_nm', headerName: '생성결과', width: 70, sortable: false},
        { field: 'result_nm', headerName: '실행결과', width: 70, sortable: false},
    ];

    const detailColumns02 = [
      { field: 'column_value', headerName: '컬럼', width: 120, editable: false},
      { field: 'before_value', headerName: '변경전', width: 120, editable: false},
      { field: 'after_value', headerName: '변경후', width: 120, editable: false},
      { field: 'forecast_sql', headerName: '예상SQL', width: 550, sortable: false},
      { field: 'status_nm', headerName: '생성결과', width: 70, sortable: false},
      { field: 'result_nm', headerName: '실행결과', width: 70, sortable: false},
    ];

    useEffect(() => {
    // 초기화 데이터를 가져오는 함수
        const fetchData = async () => {
            try {
                // 서버로부터 데이터 가져오기
                const response = await axios.get(url + `/api/public/commcode?cl_code=6&use_yb=1`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });

                // cl_code가 1인 것만 필터링하여 설정
                //const filteredData = response.data.list.filter(item => item.cl_code === "2");
                //console.log(filteredData);
                setCombo01(response.data.list);
            } catch (error) {
                console.error('데이터 불러오기 실패:', error);
            }
        };

        // fetchData 함수를 마운트될 때 한 번만 호출
        fetchData();
    }, [authToken, url]); // useEffect의 두 번째 인자로 authToken을 추가하여 authToken이 변경될 때마다 실행되도록 함

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const btnSearchClickHandler = () => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
        axios.get(url+`/api/ledgerDatabase/revive?gubun=`+selectedOption+`&search=`+searchTerm+`&page=1&limit=10000`)
        .then((response) => {
            console.log(response.data);
            setData(response.data.list);
        })
        .catch((error) => {
            console.error('데이터 불러오기 실패:', error);
        });
    };
    // 초기화버튼 클릭
    const btnClearClickHandler = () => {
        setData([]);
        setSearchTerm('');
        setSelectedOption('');
    };

    // 팝업 상세 데이터 가져오기
    const fetchDataForSelectedRow = (selectedRowId) => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        axios.get(url + `/api/ledgerDatabase/revive/${selectedRowId}`)
            .then((response) => {
                console.log(response.data);
                setDetailData(response.data);
                setDetailListData01(response.data.list);
                setDetailListData02(response.data.list2);
            })
            .catch((error) => {
                console.error('데이터 불러오기 실패:', error);
            });
    };

    // list 관리버튼 클릭
    const handleManageButtonClick = (row) => {
        setSelectedRow(row);
        setOpenDialog(true);

        fetchDataForSelectedRow(row.id);
    };

    // dialog 닫기버튼 클릭
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    // 메인 화면 검색 조건
    const searchContent = (
        <div style={{ padding: '0 0 16px 0' }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <FormControl variant="outlined" size="small">
                    <InputLabel id="select-label">구분</InputLabel>
                    <Select
                        labelId="select-label"
                        id="select"
                        defaultValue={0}
                        value={selectedOption}
                        onChange={handleSelectChange}
                        label="구분"
                        style={{ width: '200px' }}
                    >
                        {dsCombo01.map(item => (
                            <MenuItem key={item.code_id} value={item.code_id}><em>{item.code_nm}</em></MenuItem>
                        ))}
                    </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <TextField
                    id="search"
                    label="접수번호/제목"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    style={{ width: '200px' }}
                    />
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" size="medium" onClick={btnSearchClickHandler}>
                    찾기
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" size="medium" onClick={btnClearClickHandler}>
                    초기화
                    </Button>
                </Grid>
            </Grid>
        </div>
    );

    // 메인 데이터 그리드 내용
    const dataGridContent = (
        <Box sx={{ height: 650, width: '100%' }}>
            <DataGrid
                rows={data}
                columns={columns}
                initialState={{
                pagination: {
                    paginationModel: {
                    pageSize: 10,
                    },
                },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    );

    const handleExecSqlData = () => {
        const confirmed = window.confirm('작업에 시간이 걸릴 수 있습니다.\nSQL을 실행하시겠습니까?');

        if (confirmed) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
            axios.post(url+`/api/ledgerDatabase/revive/${detailData.pk}/execsql`)
            .then((response) => {
                if(response.status === 201){
                    //console.log(response.data);
                    alert('SQL실행이 완료 되었습니다.');
                    // 접수상세 재호출
                    fetchDataForSelectedRow(detailData.pk);
                }else {
                    throw new Error('SQL실행 오류: ' + response.data.detail);
                }
            })
            .catch((error) => {
                console.error('실패:', error);
                if (error.response && error.response.status === 422) {
                    alert(error.response.data.detail);
                }else{
                    alert('SQL실행 오류');
                }
            });
        }
    }
    

    // 상세에 있는 데이터 그리드
    const detailDataGridContent01 = (
        <Box sx={{ height: 200, width: 1152, marginTop:"10px"}}>
            <DataGrid
                rows={detailListdata01}
                columns={detailColumns01}
                initialState={{
                pagination: {
                    paginationModel: {
                    pageSize: 5,
                    },
                },
                }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
            />
        </Box>
    );

    // 상세에 있는 데이터 그리드
    const detailDataGridContent02 = (
        <Box sx={{ height: 200, width: 1152, marginTop:"10px"}}>
            <DataGrid
                rows={detailListdata02}
                columns={detailColumns02}
                initialState={{
                pagination: {
                    paginationModel: {
                    pageSize: 5,
                    },
                },
                }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
            />
        </Box>
    );

    // 팝업 내용
    const dialogContent = selectedRow ? (
        <div>
            <DialogTitle>원장복구 상세</DialogTitle>
            <DialogContent>
                <div style={{ marginTop: '10px' }}>
                </div>
                {detailData ? (
                    <div>
                        <div>
                            <TextField
                                id="outlined-read-only-input"
                                label="접수번호"
                                focused
                                value={detailData.jubsu_no}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{width:"140px"}}
                            />
                            <TextField
                                id="outlined-read-only-input"
                                label="제목"
                                focused
                                value={detailData.title}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{width:"1002px",marginLeft:"10px"}}
                            />
                            <h3>변경 전 작업내용</h3>
                            {detailDataGridContent01}
                            <h3>복구 작업내용</h3>
                            {detailDataGridContent02}
                        </div>
                    </div>
                ) : (
                <p>Loading...</p>
                )}
            </DialogContent>
            <DialogActions style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {detailData ? (
                    <div style={{marginLeft:"20px"}}>
                        작업건수: {detailData.totalcount}
                    </div>
                ) : (
                    <div></div>
                )}
                <div>
                    <Button variant="contained" size="small" color="warning" onClick={handleExecSqlData}>
                    실행
                    </Button>
                    <span style={{ marginRight: '10px' }}></span>
                    <Button variant="outlined" size="small" onClick={handleCloseDialog} color="primary">
                    닫기
                    </Button>
                </div>
            </DialogActions>
        </div>
    ) : null;

return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader/>
        <h2>원장복구</h2>
        <CssBaseline />
        {searchContent}
        {dataGridContent}
        <Dialog maxWidth="lg"  open={openDialog} onClose={handleCloseDialog}>
          {dialogContent}
        </Dialog>
    </Box>
  );
}