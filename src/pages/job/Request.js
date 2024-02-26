import React, { useState, useEffect } from 'react';
import Loading from '../spinner/Spinner';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
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

export default function Register() {
    const [searchJtname, setSearchJtname] = React.useState('');
    const [searchJrname, setSearchJrname] = React.useState('');
    const [selectedOption, setSelectedOption] = React.useState('');
    // const [selectedGubun, setGubunSelectedOption] = React.useState('');
    // const [selectedStatus, setStatusSelectedOption] = React.useState('');
    
    const [openDialog, setOpenDialog] = useState(false);
    const [detailData, setDetailData] = useState([]);
    const [data, setData] = useState([]); // list data
    const [dsCombo01, setCombo01] = useState([]);
    const [isButtonSaveEnabled, setButtonSaveEnabled] = useState(true);
    const [isButtonDelEnabled, setButtonDelEnabled] = useState(true);
    const url = useSelector((state) => state.baseurl.url);
    const authToken = useSelector((state) => state.authToken.authToken);
    const [loading, setLoading] = useState(false);

    const columns = [
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'create_name', headerName: '요청자', width: 70, editable: false},
        { field: 'gubun_nm', headerName: '구분', width: 70, editable: false},
        { field: 'jt_name', headerName: '스케줄명', width: 150, editable: false},
        { field: 'jr_name', headerName: 'JOB명', width: 230, editable: false},
        { field: 'status_nm', headerName: '상태', width: 70, editable: false},
        { field: 'create_date', headerName: '등록일자', width: 180, editable: false},
        { field: 'start_date', headerName: '시작일자', width: 180, editable: false},
        { field: 'end_date', headerName: '종료일자', width: 180, editable: false},
        // 관리버튼 추가
        {
            field: 'manage',
            headerName: 'Manage',
            width: 100,
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

    useEffect(() => {
        // 초기화 데이터를 가져오는 함수
        const fetchData = async () => {
            try {
                console.log("authToken"+authToken);
                const response = await axios.get(url + `/api/public/commcode?cl_code=12&use_yb=1`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                console.log(response.data);
                if (isMounted) {
                    setCombo01(response.data.list);
                }
            } catch (error) {
                console.error('데이터 불러오기 실패:', error);
            }
        };
        let isMounted = true;
        // fetchData 함수를 마운트될 때 한 번만 호출
        fetchData();
        return ()=>{
            isMounted = false;
        };
    }, [authToken,url]); // useEffect의 두 번째 인자로 authToken을 추가하여 authToken이 변경될 때마다 실행되도록 함

    const handleSearchJtnameChange = (event) => {
        setSearchJtname(event.target.value);
    };
    const handleSearchJrnameChange = (event) => {
        setSearchJrname(event.target.value);
    };
    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    // list 조회버튼 클릭
    const btnSearchClickHandler = () => {
        setLoading(true);
        console.log("authTokenauthTokenauthTokenauthTokenauthTokenauthToken"+authToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
        axios.get(url+`/api/batchJob/jobRequest?gubun=`+selectedOption+`&jt_name=`+searchJtname+`&jr_name=`+searchJrname+`&page=1&limit=10000`)
        .then((response) => {
            setLoading(false);
            console.log(response.data);
            setData(response.data.list);
        })
        .catch((error) => {
            setLoading(false);
            alert(error.response.data.detail);
            console.error('데이터 불러오기 실패:', error);
        });
    };
    // 초기화버튼 클릭
    const btnClearClickHandler = () => {
        setData([]);
        setSearchJtname('');
        setSearchJrname('');
        setSelectedOption('');
    };

    // 팝업 상세 데이터 가져오기
    const fetchDataForSelectedRow = (selectedRowId) => {
        setLoading(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        axios.get(url + `/api/batchJob/jobRequest/${selectedRowId}`)
            .then((response) => {
                setLoading(false);
                console.log(response.data);
                setDetailData(response.data);
                setButtonSaveEnabled(response.data.authSave === true);
                setButtonDelEnabled(response.data.authDel === true);
            })
            .catch((error) => {
                setLoading(false);
                alert(error.response.data.detail);
                console.error('데이터 불러오기 실패:', error);
            });
    };

    // list 관리버튼 클릭
    const handleManageButtonClick = (row) => {
        setOpenDialog(true);

        fetchDataForSelectedRow(row.id);
    };
    
    // 검색 조건
    const searchContent = (
        <div style={{ padding: '0 0 10px 0' }}>
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
                            style={{ width: '200px', height:'35px' }}
                        >
                            {dsCombo01.map(item => (
                                <MenuItem key={item.code_id} value={item.code_id}>{item.code_nm}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <TextField
                    id="search"
                    label="스케줄명"
                    variant="outlined"
                    size="small"
                    value={searchJtname}
                    onChange={handleSearchJtnameChange}
                    style={{ width: '300px'  }}
                    inputProps={{
                        style: {
                          height: "18px",
                        },
                      }}
                    />
                </Grid>
                <Grid item>
                    <TextField
                    id="search"
                    label="JOB명"
                    variant="outlined"
                    size="small"
                    value={searchJrname}
                    onChange={handleSearchJrnameChange}
                    style={{ width: '300px'  }}
                    inputProps={{
                        style: {
                          height: "18px",
                        },
                      }}
                    />
                </Grid>
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

    // 데이터 그리드 내용
    const dataGridContent = (
        <Box sx={{ height: 650, width: '100%' }}>
            <DataGrid
                density="compact"
                rowHeight={40}
                rows={data}
                columns={columns}
                initialState={{
                pagination: {
                    paginationModel: {
                    pageSize: 20,
                    },
                },
                }}
                pageSizeOptions={[5,10,20,100]}
                // checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    );

    
    
     // dialog 닫기버튼 클릭
     const handleCloseDialog = () => {
        setOpenDialog(false);
        btnSearchClickHandler();
    };

    const handleExecData = () => {
        const confirmed = window.confirm('작업에 시간이 걸릴 수 있습니다.\nJOB을 실행하시겠습니까?');

        if (confirmed) {
            setLoading(true);
            axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
            axios.post(url+`/api/batchJob/jobRequest/${detailData.pk}/execute`)
            .then((response) => {
                setLoading(false);
                if(response.status === 201){
                    //console.log(response.data);
                    alert('JOB실행이 진행 되었습니다. \n 작업요청 상세화면에서 진행 상황을 볼 수 있습니다.');
                    // 접수상세 재호출
                    fetchDataForSelectedRow(detailData.pk);
                }else {
                    throw new Error('JOB실행 오류: ' + response.data.detail);
                }
            })
            .catch((error) => {
                setLoading(false);
                console.error('실패:', error);
                if (error.response && error.response.status === 422) {
                    alert(error.response.data.detail);
                }else{
                    
                    alert('JOB실행 오류');
                }
            });
        }
    }

    const handleDelete = () => {
        setLoading(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        axios.delete(url+`/api/batchJob/jobRequest/${detailData.pk}`)
        .then((response) => {
            setLoading(false);
            if(response.status === 204){
                handleCloseDialog();
                alert('삭제처리 되었습니다.');
            }else {
                throw new Error('오류: ' + response.data.detail);
            }
        })
        .catch((error) => {
            setLoading(false);
            //console.error('실패:', error);
            if (error.response && error.response.status === 422) {
                alert(error.response.data.detail);
            }else{
                alert('SQL생성 오류');
            }
        });
    }

    // 팝업 내용
    const dialogContent = (
        <div style={{ width: '700px', height:'500px' }}>
            <DialogTitle>
                작업요청 상세
            </DialogTitle>
            <DialogContent>
                <div style={{ marginTop: '10px' }}>
                    <TextField
                        id="create_name"
                        label="요청자"
                        value={detailData.create_name}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            readOnly: true,
                            style: {
                                height: "30px",
                                shrink: true,
                                fontSize: '14px'
                            },
                        }}
                        variant="outlined"
                        size="small"
                        style={{width:"300px"}}
                    />
                    <TextField
                        id="gubun_nm"
                        label="구분"
                        value={detailData.gubun_nm}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            readOnly: true,
                            style: {
                                height: "30px",
                                shrink: true,
                                fontSize: '14px'
                            },
                        }}
                        variant="outlined"
                        size="small"
                        style={{width:"300px",marginLeft:"10px"}}
                    />
                </div>
                <div style={{ marginTop: '20px' }}>
                    <TextField
                        id="templates_name"
                        label="스케줄명"
                        value={detailData.templates_name}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            readOnly: true,
                            style: {
                                height: "30px",
                                shrink: true,
                                fontSize: '14px'
                            },
                        }}
                        variant="outlined"
                        size="small"
                        style={{width:"300px"}}
                    />
                    <TextField
                        id="request_name"
                        label="JOB명"
                        value={detailData.request_name}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            readOnly: true,
                            style: {
                                height: "30px",
                                shrink: true,
                                fontSize: '14px'
                            },
                        }}
                        variant="outlined"
                        size="small"
                        style={{width:"300px",marginLeft:"10px"}}
                    />
                </div>
                <div style={{ marginTop: '20px' }}>
                    <TextField
                        id="status_nm"
                        label="상태"
                        value={detailData.status_nm}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            readOnly: true,
                            style: {
                                height: "30px",
                                shrink: true,
                                fontSize: '14px'
                            },
                        }}
                        variant="outlined"
                        size="small"
                        style={{width:"300px"}}
                    />
                    <TextField
                        id="create_date"
                        label="등록일자"
                        value={detailData.create_date}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            readOnly: true,
                            style: {
                                height: "30px",
                                shrink: true,
                                fontSize: '14px'
                            },
                        }}
                        variant="outlined"
                        size="small"
                        style={{width:"300px",marginLeft:"10px"}}
                    />
                </div>
                <div style={{ marginTop: '20px' }}>
                    <TextField
                        id="start_date"
                        label="시작일자"
                        value={detailData.start_date}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            readOnly: true,
                            style: {
                                height: "30px",
                                shrink: true,
                                fontSize: '14px'
                            },
                        }}
                        variant="outlined"
                        size="small"
                        style={{width:"300px"}}
                    />
                    <TextField
                        id="end_date"
                        label="종료일자"
                        value={detailData.end_date}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            readOnly: true,
                            style: {
                                height: "30px",
                                shrink: true,
                                fontSize: '14px'
                            },
                        }}
                        variant="outlined"
                        size="small"
                        style={{width:"300px",marginLeft:"10px"}}
                    />
                </div>
                <div style={{ marginTop: '20px' }}>
                    <TextField
                        id="log"
                        label="실행기록"
                        value={detailData.log}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            readOnly: true,
                            style: {
                                height: "150px",
                                fontSize: '14px'
                            },
                        }}
                        multiline
                        rows={6}
                        style={{width:"610px"}}
                        variant="outlined"
                        size="small"
                    />
                </div>
            </DialogContent>
            <DialogActions style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width:"99%" }}>
                {detailData ? (
                    <>
                    <div style={{marginLeft:"20px"}}>
                        {isButtonDelEnabled && (
                        <Button variant="contained" size="small" color="error" onClick={handleDelete}>
                        삭제
                        </Button>
                        )}
                    </div>
                    </>
                ) : (
                    <div></div>
                )}
                <div style={{ marginLeft: 'auto' }}>
                    <Button variant="contained" size="small" color="primary" onClick={handleExecData} disabled={!isButtonSaveEnabled}>
                    실행
                    </Button>
                    <span style={{ marginRight: '10px' }}></span>
                    <Button variant="outlined" size="small" onClick={handleCloseDialog} color="primary">
                    닫기
                    </Button>
                    <span style={{ marginRight: '50px' }}></span>
                </div>
            </DialogActions>
        </div>
    );

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop:"35px" }}>
            <h2 style={{marginTop:"20px"}}>배치관리-작업요청</h2>
            <CssBaseline />
            {searchContent}
            {loading ? <Loading/> : null}
            {dataGridContent}
            <Dialog maxWidth="lg"  open={openDialog} onClose={handleCloseDialog}>
                {loading ? <Loading/> : null}
                {dialogContent}
            </Dialog>
        </Box>
    );
}