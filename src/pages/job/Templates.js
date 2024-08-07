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
    InputLabel
  } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
// import cronParser from 'cron-parser';
import FormControl from '@mui/material/FormControl';
// import Radio from '@mui/material/Radio';
// import RadioGroup from '@mui/material/RadioGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import FormLabel from '@mui/material/FormLabel'; 


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function Register() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedGubun, setSelectedGubun] = React.useState('3');
    const [selectedStatus, setSelectedStatus] = React.useState('0');

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [detailData, setDetailData] = useState({
        pk: '',
        gubun: '1',
        name: '',
        status: '1',
        executionscript: '',
        description: '',
        buildschedule: '',
    });
    const [data, setData] = useState([]); // list data
    const [dsCombo01, setCombo01] = useState([]);
    const [dsCombo02, setCombo02] = useState([]);
    const [dsCombo03, setCombo03] = useState([]);
    const [isButtonSaveEnabled, setButtonSaveEnabled] = useState(true);
    const [isButtonDelEnabled, setButtonDelEnabled] = useState(true);
    const [isButtonExecEnabled, setButtonExecEnabled] = useState(true);
    const url = useSelector((state) => state.baseurl.url);
    const authToken = useSelector((state) => state.authToken.authToken);
    const sawon_cd = useSelector((state) => state.user.sawon_cd);
    const [loading, setLoading] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [isButtonCreateEnabled, setButtonCreateEnabled] = useState(false);
    function createData(gubun, name, value) {
        return { gubun, name, value };
    }
    
    const initialParams = [
    createData('Param1', '', ''),
    createData('Param2', '', ''),
    ];
    const [params, setParams] = useState(initialParams);
    // const [radioValue, setRadioValue] = useState('1');

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'gubun_nm', headerName: '구분', width: 100, editable: false},
        { field: 'name', headerName: '스케줄명', width: 300, editable: false},
        { field: 'status_nm', headerName: '상태', width: 100, editable: false},
        ...(selectedGubun==='3' ? [{ field: 'build_schedule', headerName: '실행주기', width: 150, editable: false}] : []),
        { field: 'update_date', headerName: '최종변경일자', width: 180, editable: false},
        { field: 'update_name', headerName: '최종변경자', width: 120, editable: false},
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
    
    
    useEffect(() => {
        // 초기화 데이터를 가져오는 함수
        const fetchData = async () => {
            let detailGubun;
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
                    const gubunArr = response.data.list;
                    detailGubun = gubunArr.filter(status => status.code_id!=='1');
                    // console.log("detailGubun : "+JSON.stringify(detailGubun,null, 2));
                    // setCombo01(detailGubun);
                }
            } catch (error) {
                console.error('데이터 불러오기 실패:', error);
            }
            try {
                console.log("authToken"+authToken);
                const response = await axios.get(url + `/api/public/commcode?cl_code=11&use_yb=1`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                console.log(response.data);
                if (isMounted) {
                    setCombo02(response.data.list);
                    const statusArr = response.data.list;
                    console.log("type : "+Object.prototype.toString.call(statusArr).slice(8,-1));
                    const detailStatus = statusArr.filter(status => status.code_id!=='0');
                    console.log("detailStatus : "+detailStatus);
                    setCombo03(detailStatus);
                }
            } catch (error) {
                console.error('데이터 불러오기 실패:', error);
            }

            try {
                const response = await axios.get(url + `/api/public/commcode?cl_code=14&use_yb=1`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                console.log(response.data);
                if (isMounted) {
                    const adminArr = response.data.list;
                    if(adminArr.some(item => item.code_id === sawon_cd)){
                        console.log("관리자가 맞음");
                        setButtonCreateEnabled(true);
                    }else{
                        console.log("관리자가 아님");
                        // setButtonCreateEnabled(false);
                    }
                }
            } catch (error) {
                console.error('데이터 불러오기 실패:', error);
            }

            try {
                const response = await axios.get(url + `/api/public/commcode?cl_code=15&use_yb=1`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                console.log(response.data);
                if (isMounted) {
                    const adminArr = response.data.list;
                    if(adminArr.some(item => item.code_id === sawon_cd)){
                        console.log("관리자가 맞음");
                        setCombo01(detailGubun);
                        setButtonCreateEnabled(true);
                    }else{
                        console.log("관리자가 아님");
                        // setButtonCreateEnabled(false);
                    }
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
    }, [authToken,url, sawon_cd]); // useEffect의 두 번째 인자로 authToken을 추가하여 authToken이 변경될 때마다 실행되도록 함

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleGubunChange = (event) => {
        setSelectedGubun(event.target.value);
    };

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };

    // list 조회버튼 클릭
    const btnSearchClickHandler = () => {
        setLoading(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
        axios.get(url+`/api/batchJob/jobTemplates?gubun=`+selectedGubun+`&status=`+selectedStatus+`&search=`+searchTerm+`&page=1&limit=10000`)
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
        setSearchTerm('');
        setSelectedGubun('1');
        setSelectedStatus('0');
    };
    const btnCreateClickHandler = (event) => {
        setSelectedRow(null);
        setDetailData([]);
        setParams(initialParams);
        setOpenDialog(true);
    };
    // const radioChangeHandler = (event) => {
    //     setRadioValue(event.target.value);
    // };
    // 팝업 상세 데이터 가져오기
    const fetchDataForSelectedRow = (selectedRowId) => {
        setLoading(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        axios.get(url + `/api/batchJob/jobTemplates/${selectedRowId}`)
            .then((response) => {
                setLoading(false);
                console.log(response.data);
                setDetailData(response.data);
                // if (response.data.params) {
                //     const newParams = response.data.params.map((param, index) => 
                //         createData(`Param${index + 1}`, param.name, param.value)
                //     );
                //     setParams(newParams);
                // }
                // const newParams = [
                //     createData('Param1', response.data.params.name || '', response.data.params.value || ''),
                //     createData('Param2', response.data.params.name || '', response.data.params.value || '')
                // ];
                // setParams(newParams);
                // setParams(response.data.params);
                const updatedParams = response.data.params.map((param, index) => ({
                    gubun: `Param${index + 1}`,
                    name: param.name || '',
                    value: param.value || '',
                }));
                console.log(updatedParams);
                setParams(updatedParams);
                setButtonSaveEnabled(response.data.authSave === true);
                setButtonDelEnabled(response.data.authDel === true);
                setButtonExecEnabled(response.data.authExec === true);
            })
            .catch((error) => {
                setLoading(false);
                alert(error.response.data.detail);
                console.error('데이터 불러오기 실패:', error);
            });
    };

    // list 관리버튼 클릭
    const handleManageButtonClick = (row) => {
        setSelectedRow(row);
        setOpenDialog(true);
        fetchDataForSelectedRow(row.id);
    };
    
    // 검색 조건
    const searchContent = (
        <div style={{ padding: '0 0 10px 0' }}>
            <Grid container spacing={2} alignItems="center">
                {/* <Grid item>
                    <FormControl sx={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FormLabel id="demo-controlled-radio-buttons-group" sx={{ marginRight: 2 }}>구분</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={radioValue}
                            onChange={radioChangeHandler}
                        >
                            <FormControlLabel value="3" control={<Radio />} label="Cron" />
                            <FormControlLabel value="1" control={<Radio />} label="수수료" />
                        </RadioGroup>
                    </FormControl>
                </Grid> */}
                <Grid item>
                    <FormControl variant="outlined" size="small">
                        <InputLabel id="select-label">구분</InputLabel>
                        <Select
                            labelId="select-label"
                            id="select"
                            defaultValue={0}
                            value={selectedGubun}
                            onChange={handleGubunChange}
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
                    <FormControl variant="outlined" size="small">
                        <InputLabel id="select-label">상태</InputLabel>
                        <Select
                            labelId="select-label"
                            id="select"
                            defaultValue={0}
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            label="상태"
                            style={{ width: '200px', height:'35px' }}
                        >
                            {dsCombo02.map(item => (
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
                    value={searchTerm}
                    onChange={handleSearchTermChange}
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
                <Grid item>
                    <Button variant="contained" color="primary" size="small" onClick={btnCreateClickHandler} style={{ display: isButtonCreateEnabled ? "flex" : "none" }}>
                    신규등록
                    </Button>
                </Grid>
            </Grid>
        </div>
    );

    // 데이터 그리드 내용
    const dataGridContent = (
        <Box sx={{ width: '100%', height: 660, overflowX: 'auto' }}>
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

    //값을 변경하는 함수
    // const handleGubunSelectChange = (event) => {
    //     setGubunSelectedOption(event.target.value);
    // };
    // const handleStatusSelectChange = (event) => {
    //     setStatusSelectedOption(event.target.value);
    // };
    const handleGubunSelectChange = (event) => {
        // 입력 필드에서 값을 가져와서 detailData를 업데이트합니다.
        const newValue = event.target.value;
        setDetailData({ ...detailData, gubun: newValue, buildschedule: ''  });
    };
    const handleNameChange = (event) => {
        const newValue = event.target.value;
        setDetailData({ ...detailData, name: newValue });
    };
    const handleSchedulerChange = (event) => {
        const newValue = event.target.value;
        setDetailData({ ...detailData, buildschedule: newValue });
    };
    const handleStatusSelectChange = (event) => {
        const newValue = event.target.value;
        console.log(newValue)
        setDetailData({ ...detailData, status: newValue });
    };
    const handleExecutionScriptChange = (event) => {
        const newValue = event.target.value;
        setDetailData({ ...detailData, executionscript: newValue });
    };
    const handleDescriptionChange = (event) => {
        const newValue = event.target.value;
        setDetailData({ ...detailData, description: newValue });
    };
    const handleParamChange = (index, key, value) => {
        const newParams = [...params];
        newParams[index][key] = value;
        console.log(newParams)
        setParams(newParams);
    };
    const handleUpdateDetailData = () => {
        if (url!=='https://was-dos.incar.co.kr'){
            alert('잘못된 접근입니다.');
            return;
        }
        console.log(detailData.status+detailData.description)
        setLoading(true);        
        const send_data = {
                            status:detailData.status
                            , description:detailData.description};
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        axios.patch(url+`/api/batchJob/jobTemplates/${detailData.pk}`, send_data)
        .then((response) => {
            setLoading(false);
            console.log(response);
            if(response.status === 200){
                fetchDataForSelectedRow(detailData.pk);
                alert('저장되었습니다');
            } else {
                //alert('저장 오류');
                console.log(response.data.detail);
                throw new Error('저장 오류: ' + response.data.detail);
            }
        })
        .catch((error) => {
            setLoading(false);
            //console.error('실패:', error);
            //alert(error.response.status);
            if (error.response && error.response.status === 422) {
                alert(error.response.data.detail);
            }else{
                alert('저장 오류');
            }
        });
    };
    const handleCreateTemplates = () => {
        if (url!=='https://was-dos.incar.co.kr'){
            alert('잘못된 접근입니다.');
            return;
        }
        try {
            // const defaultCron = "0 0 * * *"
            // cronParser.parseExpression(detailData.buildschedule || defaultCron);
            setIsValid(true);
            setLoading(true);
            const send_data = {
                gubun:detailData.gubun
                , name:detailData.name
                , status:detailData.status
                , executionscript:detailData.executionscript
                , description:detailData.description
                , buildschedule:detailData.buildschedule
                , params:params};
            console.log(send_data);
            axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
            axios.post(url+`/api/batchJob/jobTemplates`, send_data)
            .then((response) => {
                setLoading(false);
                if(response.status === 201){
                    // fetchDataForSelectedRow(detailData.pk);
                    handleCloseDialog()
                    alert('작업목록 생성이 완료 되었습니다.');
                }else {
                    console.log(response);
                    throw new Error('작업목록 생성 오류: ' + response.data.detail);
                }
            })
            .catch((error) => {
                setLoading(false);
                //console.error('실패:', error);
                if (error.response && error.response.status === 422) {
                    alert(error.response.data.detail);
                }else{
                    alert('작업목록 생성 오류');
                }
            });
        } catch (error) {
            setIsValid(false);
        }

    
    }

    const handleDelete = () => {
        if (url!=='https://was-dos.incar.co.kr'){
            alert('잘못된 접근입니다.');
            return;
        }
        setLoading(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        axios.delete(url+`/api/batchJob/jobTemplates/${detailData.pk}`)
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

    const handleExecData = () => {
        if (url!=='https://was-dos.incar.co.kr'){
            alert('잘못된 접근입니다.');
            return;
        }
        const confirmed = window.confirm('작업에 시간이 걸릴 수 있습니다.\nJOB을 실행하시겠습니까?');

        if (confirmed) {
            setLoading(true);
            const send_data = {
                params:params};
            axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
            axios.post(url+`/api/batchJob/jobTemplates/${detailData.pk}/execute`,send_data)
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

    // 팝업 내용
    const dialogContent = (
        <div style={{ width: '700px', height:'700px' }}>
            <DialogTitle>
                {selectedRow ? '작업목록 상세' : '작업목록 신규등록'}
            </DialogTitle>
            <DialogContent>
                <div style={{ marginTop: '10px' }}>
                    <FormControl variant="outlined" size="small">
                        <InputLabel id="select-label">구분</InputLabel>
                        <Select
                            labelId="select-label"
                            id="select"
                            defaultValue={1}
                            value={detailData.gubun ? detailData.gubun:setDetailData({ ...detailData, gubun: '3' })}
                            onChange={handleGubunSelectChange}
                            label="구분"
                            style={{ width: '300px', height:'30px', fontSize:'14px' }}
                            disabled={detailData.pk}
                        >
                            {dsCombo01.map(item => (
                                <MenuItem key={item.code_id} value={item.code_id}>{item.code_id==='0' ? '구분' : item.code_nm}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" size="small">
                        <InputLabel id="select-label">상태</InputLabel>
                        <Select
                            labelId="select-label"
                            id="select"
                            defaultValue={1}
                            value={detailData.status ? detailData.status:setDetailData({ ...detailData, status: '1' })}
                            onChange={handleStatusSelectChange}
                            label="상태"
                            style={{ width: '300px', height:'30px', fontSize:'14px',marginLeft:"10px" }}
                        >
                            {dsCombo03.map(item => (
                                <MenuItem key={item.code_id} value={item.code_id}>{item.code_nm}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <TextField
                        id="outlined-read-only-input"
                        label="스케줄명"
                        value={detailData.name || ""}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            readOnly: false,
                            style: {
                                height: "30px",
                                shrink: true,
                                fontSize: '14px'
                            },
                        }}
                        onChange={handleNameChange}
                        variant="outlined"
                        size="small"
                        style={{width:"610px"}}
                        disabled={detailData.pk}
                    />
                    
                    {/* <TextField
                        id="outlined-read-only-input"
                        label="구성프로그램"
                        value={detailData.executionscript}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            readOnly: false,
                            style: {
                                height: "30px",
                                fontSize: '14px'
                            },
                        }}
                        onChange={handleExecutionScriptChange}
                        variant="outlined"
                        size="small"
                        style={{width:"400px",marginLeft:"10px"}}
                    /> */}
                </div>
                <div style={{ marginTop: '20px' }}>
                    <TableContainer component={Paper} style={{width:"610px"}} >
                        <Table sx={{ minWidth: 610 }} aria-label="caption table">
                            <TableHead>
                            <TableRow>
                                <TableCell sx={{padding:'4px'}} align="center">매개변수</TableCell>
                                <TableCell sx={{padding:'4px'}} align="center">Name</TableCell>
                                <TableCell sx={{padding:'4px'}} align="center">Value</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {params.map((row, index) => (
                                <TableRow key={row.gubun}>
                                <TableCell component="th" scope="row" align="center">
                                    {row.gubun}
                                </TableCell>
                                <TableCell align="center" sx={{padding:'4px'}}>
                                    <TextField
                                    value={row.name}
                                    onChange={(e)=>handleParamChange(index, 'name', e.target.value)}
                                    size="small"
                                    InputProps={{
                                        readOnly: !!detailData.pk,
                                        style: {
                                            height: "30px",
                                            shrink: true,
                                            fontSize: '14px',
                                            width:'200px'
                                        },
                                    }}
                                    />
                                </TableCell>
                                <TableCell align="center" sx={{padding:'4px'}}>
                                    <TextField
                                    value={row.value}
                                    onChange={(e)=>handleParamChange(index, 'value', e.target.value)}
                                    size="small"
                                    InputProps={{
                                        readOnly: !(detailData.pk && row.name),
                                        style: {
                                            height: "30px",
                                            shrink: true,
                                            fontSize: '14px',
                                            width:'200px'
                                        },
                                    }}
                                    />
                                </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                
                </div>
                
                <div style={{ display: detailData.gubun==='3' ? "flex" : "none", marginTop: '20px' }}>
                    <TextField
                        id="outlined-read-only-input"
                        label="실행주기"
                        value={detailData.buildschedule || ""}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            readOnly: false,
                            style: {
                                height: "30px",
                                shrink: true,
                                fontSize: '14px'
                            },
                        }}
                        onChange={handleSchedulerChange}
                        variant="outlined"
                        size="small"
                        style={{width:"610px"}}
                        disabled={detailData.pk}
                    />
                </div>
                <div style={{ display: isValid ? "none" : "flex", height:"30px", alignItems: 'flex-start', justifyContent: 'center',}}>
                    ※ CRON 실행 규칙에 오류가 있습니다.
                </div>
                <div style={{ marginTop: '20px' }}>
                    <TextField
                        id="executionscript"
                        label="구성프로그램"
                        value={detailData.executionscript || ""}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            readOnly: false,
                            style: {
                                height: "100px",
                                fontSize: '14px'
                            },
                        }}
                        onChange={handleExecutionScriptChange}
                        multiline
                        rows={4}
                        style={{width:"610px"}}
                        variant="outlined"
                        size="small"
                        disabled={detailData.pk}
                    />
                </div>
                <div style={{ marginTop: '20px' }}>
                    <TextField
                        id="description"
                        label="작업설명"
                        value={detailData.description || ""}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            readOnly: false,
                            style: {
                                height: "100px",
                                fontSize: '14px'
                            },
                        }}
                        onChange={handleDescriptionChange}
                        multiline
                        rows={4}
                        style={{width:"610px"}}
                        variant="outlined"
                        size="small"
                    />
                </div>
            </DialogContent>
            <DialogActions style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width:"99%" }}>
                {detailData.pk ? (
                    <>
                    <div style={{marginLeft:"20px"}}>
                        {isButtonDelEnabled && (
                        <>
                        <Button variant="contained" size="small" color="error" onClick={handleDelete}>
                        삭제
                        </Button>
                        <span style={{ marginRight: '10px' }}></span>
                        <Button variant="contained" size="small" color="primary" onClick={handleExecData} disabled={!isButtonExecEnabled}>
                        실행
                        </Button>
                        </>
                        )}
                    </div>
                    </>
                ) : (
                    <div></div>
                )}
                <div style={{ marginLeft: 'auto' }}>
                    {selectedRow ? 
                    <Button variant="contained" size="small" color="primary" onClick={handleUpdateDetailData} disabled={!isButtonSaveEnabled}>
                    저장
                    </Button>
                    :
                    <Button variant="contained" size="small" color="primary" onClick={handleCreateTemplates}>
                    등록
                    </Button>
                    }
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
            <h2 style={{marginTop:"20px"}}>배치관리-작업목록</h2>
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

// import React, { useState, useEffect } from 'react';
// import Loading from '../spinner/Spinner';
// import { Button, Classes, Intent, MenuItem, Spinner, HotkeysProvider  } from "@blueprintjs/core";
// import { ControlGroup, FormGroup, InputGroup, Callout, TextArea , Label} from "@blueprintjs/core";
// import { Select } from '@blueprintjs/select';
// import { Cell, Column, Table2 } from "@blueprintjs/table";
// import "@blueprintjs/core/lib/css/blueprint.css";
// import "@blueprintjs/icons/lib/css/blueprint-icons.css";
// import "@blueprintjs/select/lib/css/blueprint-select.css";
// import "@blueprintjs/table/lib/css/table.css";
// import { HTMLTable } from "@blueprintjs/core";
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import DialogActions from '@mui/material/DialogActions';
// import Box from '@mui/material/Box';
// import CssBaseline from '@mui/material/CssBaseline';
// import Grid from '@mui/material/Grid';
// import axios from 'axios';
// import { useSelector } from "react-redux";
// import {
//     TextField,
//     FormControl,
//     InputLabel
//   } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';

// export default function Register() {
//     const [searchTerm, setSearchTerm] = React.useState('');
//     const [selectedOption, setSelectedOption] = React.useState('');
//     // const [selectedGubun, setGubunSelectedOption] = React.useState('');
//     // const [selectedStatus, setStatusSelectedOption] = React.useState('');
    
//     const [openDialog, setOpenDialog] = useState(false);
//     const [selectedRow, setSelectedRow] = useState(null);
//     const [detailData, setDetailData] = useState([]);
//     const [data, setData] = useState([]); // list data
//     const [dsCombo01, setCombo01] = useState([]);
//     const [dsCombo02, setCombo02] = useState([]);
//     const [isButtonSaveEnabled, setButtonSaveEnabled] = useState(true);
//     const [isButtonDelEnabled, setButtonDelEnabled] = useState(true);
//     const url = useSelector((state) => state.baseurl.url);
//     const authToken = useSelector((state) => state.authToken.authToken);
//     const [loading, setLoading] = useState(false);

//     const columns = [
//         { label: 'ID', key: 'id' },
//         { label: '구분', key: 'gubun_nm' },
//         { label: '스케줄명', key: 'name' },
//         { label: '상태', key: 'status_nm' },
//         { label: '최종변경일자', key: 'update_date' },
//         { label: '최종변경자', key: 'update_name' },
//         {
//           label: 'Manage',
//           key: 'manage',
//           renderCell: (row) => (
//             <Button
//               intent={Intent.PRIMARY}
//               onClick={() => handleManageButtonClick(row)}
//               small
//               style={{ height:'15px', fontSize:'12px' }}
//             >
//               관리
//             </Button>
//           ),
//         },
//       ];

//     useEffect(() => {
//         // 초기화 데이터를 가져오는 함수
//         const fetchData = async () => {
//             try {
//                 console.log("authToken"+authToken);
//                 const response = await axios.get(url + `/api/public/commcode?cl_code=12&use_yb=1`, {
//                     headers: {
//                         'Authorization': `Bearer ${authToken}`
//                     }
//                 });
//                 console.log(response.data);
//                 if (isMounted) {
//                     setCombo01(response.data.list);
//                 }
//             } catch (error) {
//                 console.error('데이터 불러오기 실패:', error);
//             }
//             try {
//                 console.log("authToken"+authToken);
//                 const response = await axios.get(url + `/api/public/commcode?cl_code=11&use_yb=1`, {
//                     headers: {
//                         'Authorization': `Bearer ${authToken}`
//                     }
//                 });
//                 console.log(response.data);
//                 if (isMounted) {
//                     setCombo02(response.data.list);
//                 }
//             } catch (error) {
//                 console.error('데이터 불러오기 실패:', error);
//             }
//         };
//         let isMounted = true;
//         // fetchData 함수를 마운트될 때 한 번만 호출
//         fetchData();
//         return ()=>{
//             isMounted = false;
//         };
//     }, [authToken,url]); // useEffect의 두 번째 인자로 authToken을 추가하여 authToken이 변경될 때마다 실행되도록 함

//     const handleSearchTermChange = (event) => {
//         setSearchTerm(event.target.value);
//     };

//     const handleSelectChange = (event) => {
//         setSelectedOption(event.target.value);
//     };

//     // list 조회버튼 클릭
//     const btnSearchClickHandler = () => {
//         setLoading(true);
//         console.log("authTokenauthTokenauthTokenauthTokenauthTokenauthToken"+authToken);
//         axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
//         axios.get(url+`/api/batchJob/jobTemplates?gubun=`+selectedOption+`&search=`+searchTerm+`&page=1&limit=10000`)
//         .then((response) => {
//             setLoading(false);
//             console.log(response.data);
//             setData(response.data.list);
//         })
//         .catch((error) => {
//             setLoading(false);
//             console.error('데이터 불러오기 실패:', error);
//         });
//     };
//     // 초기화버튼 클릭
//     const btnClearClickHandler = () => {
//         setData([]);
//         setSearchTerm('');
//         setSelectedOption('');
//     };
//     const btnCreateClickHandler = (event) => {
//         setOpenDialog(true);
//     };
//     // 팝업 상세 데이터 가져오기
//     const fetchDataForSelectedRow = (selectedRowId) => {
//         setLoading(true);
//         axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
//         axios.get(url + `/api/batchJob/jobTemplates/${selectedRowId}`)
//             .then((response) => {
//                 setLoading(false);
//                 console.log(response.data);
//                 setDetailData(response.data);
//                 setButtonSaveEnabled(response.data.authSave === true);
//                 setButtonDelEnabled(response.data.authDel === true);
//             })
//             .catch((error) => {
//                 setLoading(false);
//                 console.error('데이터 불러오기 실패:', error);
//             });
//     };

//     // list 관리버튼 클릭
//     const handleManageButtonClick = (row) => {
//         setSelectedRow(row);
//         setOpenDialog(true);

//         fetchDataForSelectedRow(row.id);
//     };
    
//     // 검색 조건
//     const searchContent = (
//         <div style={{ display: "flex", alignItems: "baseline"}}>
//             <FormGroup style={{ display: "flex", alignItems: "center", marginRight: "10px" }}>
//                 <label htmlFor="select" style={{ marginRight: "10px" }}>구분</label>
//                 <select
//                     value={selectedOption}
//                     onChange={handleSelectChange}
//                     style={{ width: '200px', height: '25px' }}
//                 >
//                     {dsCombo01.map(item => (
//                     <option key={item.code_id} value={item.code_id}>{item.code_nm}</option>
//                     ))}
//                 </select>
//             </FormGroup>
//             <FormGroup style={{ display: "flex", alignItems: "center", marginRight: "10px" }}>
//                 <label htmlFor="search" style={{ marginRight: "10px" }}>스케줄명</label>
//                 <input
//                     id="search"
//                     placeholder="스케줄명을 입력하세요"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     style={{ width: '200px', height: '25px' }}
//                 />
//             </FormGroup>
//             <Button intent={Intent.SUCCESS} small onClick={btnSearchClickHandler}>찾기</Button>
//             <Button intent={Intent.PRIMARY} small onClick={btnClearClickHandler} style={{ marginLeft: "10px", marginRight: "10px" }}>초기화</Button>
//             <Button intent={Intent.DANGER} small onClick={btnCreateClickHandler}>신규등록</Button>
//         </div>
//       );

//       const dataGridContent = (
//         <div style={{ width: '100%', overflowX: 'auto' }}>
//             <HotkeysProvider>
//           <Table2 numRows={data.length}>
//             {columns.map(col => (
//               <Column
//                 key={col.key}
//                 name={col.label}
//                 cellRenderer={(rowIndex) => (
//                   <Cell>{col.renderCell ? col.renderCell(data[rowIndex]) : data[rowIndex][col.key]}</Cell>
//                 )}
//               />
//             ))}
//           </Table2>
//           </HotkeysProvider>
//         </div>
//       );
    
    
//      // dialog 닫기버튼 클릭
//      const handleCloseDialog = () => {
//         setOpenDialog(false);
//         btnSearchClickHandler();
//     };

//     //값을 변경하는 함수
//     // const handleGubunSelectChange = (event) => {
//     //     setGubunSelectedOption(event.target.value);
//     // };
//     // const handleStatusSelectChange = (event) => {
//     //     setStatusSelectedOption(event.target.value);
//     // };
//     const handleGubunSelectChange = (event) => {
//         // 입력 필드에서 값을 가져와서 detailData를 업데이트합니다.
//         const newValue = event.target.value;
//         setDetailData({ ...detailData, gubun: newValue });
//     };
//     const handleNameChange = (event) => {
//         const newValue = event.target.value;
//         setDetailData({ ...detailData, name: newValue });
//     };
//     const handleStatusSelectChange = (event) => {
//         const newValue = event.target.value;
//         setDetailData({ ...detailData, status: newValue });
//     };
//     const handleExecutionScriptChange = (event) => {
//         const newValue = event.target.value;
//         setDetailData({ ...detailData, executionscript: newValue });
//     };
//     const handleDescriptionChange = (event) => {
//         const newValue = event.target.value;
//         setDetailData({ ...detailData, description: newValue });
//     };

//     const handleUpdateDetailData = () => {
//         setLoading(true);        
//         const send_data = {
//                             gubun:detailData.gubun
//                             , name:detailData.name
//                             , status:detailData.status
//                             , executionscript:detailData.executionscript
//                             , description:detailData.description};
//         axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
//         axios.patch(url+`/api/batchJob/jobTemplates/${detailData.pk}`, send_data)
//         .then((response) => {
//             setLoading(false);
//             console.log(response);
//             if(response.status === 200){
//                 fetchDataForSelectedRow(detailData.pk);
//                 alert('저장되었습니다');
//             } else {
//                 //alert('저장 오류');
//                 throw new Error('저장 오류: ' + response.data.detail);
//             }
//         })
//         .catch((error) => {
//             setLoading(false);
//             //console.error('실패:', error);
//             //alert(error.response.status);
//             if (error.response && error.response.status === 422) {
//                 alert(error.response.data.detail);
//             }else{
//                 alert('저장 오류');
//             }
//         });
//     };

//     const handleCreateTemplates = () => {
//         setLoading(true);
//         const send_data = {
//             gubun:detailData.gubun
//             , name:detailData.name
//             , status:detailData.status
//             , executionscript:detailData.executionscript
//             , description:detailData.description};
//         axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
//         axios.post(url+`/api/batchJob/jobTemplates`, send_data)
//         .then((response) => {
//             setLoading(false);
//             if(response.status === 201){
//                 fetchDataForSelectedRow(detailData.pk);
//                 alert('SQL생성이 완료 되었습니다.');
//             }else {
//                 throw new Error('SQL생성 오류: ' + response.data.detail);
//             }
//         })
//         .catch((error) => {
//             setLoading(false);
//             //console.error('실패:', error);
//             if (error.response && error.response.status === 422) {
//                 alert(error.response.data.detail);
//             }else{
//                 alert('SQL생성 오류');
//             }
//         });
//     }

//     const handleDelete = () => {
//         setLoading(true);
//         axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
//         axios.delete(url+`/api/batchJob/jobTemplates/${detailData.pk}`)
//         .then((response) => {
//             setLoading(false);
//             if(response.status === 204){
//                 handleCloseDialog();
//                 alert('삭제처리 되었습니다.');
//             }else {
//                 throw new Error('오류: ' + response.data.detail);
//             }
//         })
//         .catch((error) => {
//             setLoading(false);
//             //console.error('실패:', error);
//             if (error.response && error.response.status === 422) {
//                 alert(error.response.data.detail);
//             }else{
//                 alert('SQL생성 오류');
//             }
//         });
//     }

//     // 팝업 내용
//     const dialogContent = (
//         <div style={{ width: '700px', height:'500px' }}>
//             <DialogTitle>
//                 {selectedRow ? '작업목록 상세' : '작업목록 신규등록'}
//             </DialogTitle>
//             <DialogContent>
//                 <div style={{ marginTop: '10px' }}>
//                     <FormControl variant="outlined" size="small">
//                         <InputLabel id="select-label">구분</InputLabel>

//                     </FormControl>
//                     <FormControl variant="outlined" size="small">
//                         <InputLabel id="select-label">상태</InputLabel>

//                     </FormControl>
//                 </div>
//                 <div style={{ marginTop: '20px' }}>
//                     <TextField
//                         id="outlined-read-only-input"
//                         label="스케줄명"
//                         value={detailData.name}
//                         InputLabelProps={{
//                             shrink: true,
//                         }}
//                         InputProps={{
//                             readOnly: false,
//                             style: {
//                                 height: "30px",
//                                 shrink: true,
//                                 fontSize: '14px'
//                             },
//                         }}
//                         onChange={handleNameChange}
//                         variant="outlined"
//                         size="small"
//                         style={{width:"610px"}}
//                     />
                    
//                     {/* <TextField
//                         id="outlined-read-only-input"
//                         label="구성프로그램"
//                         value={detailData.executionscript}
//                         InputLabelProps={{
//                             shrink: true,
//                         }}
//                         InputProps={{
//                             readOnly: false,
//                             style: {
//                                 height: "30px",
//                                 fontSize: '14px'
//                             },
//                         }}
//                         onChange={handleExecutionScriptChange}
//                         variant="outlined"
//                         size="small"
//                         style={{width:"400px",marginLeft:"10px"}}
//                     /> */}
//                 </div>
//                 <div style={{ marginTop: '20px' }}>
//                     <TextField
//                         id="executionscript"
//                         label="구성프로그램"
//                         value={detailData.executionscript}
//                         InputLabelProps={{
//                             shrink: true,
//                         }}
//                         InputProps={{
//                             readOnly: false,
//                             style: {
//                                 height: "100px",
//                                 fontSize: '14px'
//                             },
//                         }}
//                         onChange={handleExecutionScriptChange}
//                         multiline
//                         rows={4}
//                         style={{width:"610px"}}
//                         variant="outlined"
//                         size="small"
//                     />
//                 </div>
//                 <div style={{ marginTop: '20px' }}>
//                     <TextField
//                         id="description"
//                         label="작업설명"
//                         value={detailData.description}
//                         InputLabelProps={{
//                             shrink: true,
//                         }}
//                         InputProps={{
//                             readOnly: false,
//                             style: {
//                                 height: "100px",
//                                 fontSize: '14px'
//                             },
//                         }}
//                         onChange={handleDescriptionChange}
//                         multiline
//                         rows={4}
//                         style={{width:"610px"}}
//                         variant="outlined"
//                         size="small"
//                     />
//                 </div>
//             </DialogContent>
//             <DialogActions style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width:"99%" }}>
//                 {detailData ? (
//                     <>
//                     <div style={{marginLeft:"20px"}}>
//                         {isButtonDelEnabled && (
//                         <Button variant="contained" size="small" color="error" onClick={handleDelete}>
//                         삭제
//                         </Button>
//                         )}
//                     </div>
//                     </>
//                 ) : (
//                     <div></div>
//                 )}
//                 <div style={{ marginLeft: 'auto' }}>
//                     {selectedRow ? 
//                     <Button variant="contained" size="small" color="primary" onClick={handleUpdateDetailData} disabled={!isButtonSaveEnabled}>
//                     저장
//                     </Button>
//                     :
//                     <Button variant="contained" size="small" color="primary" onClick={handleCreateTemplates}>
//                     등록
//                     </Button>
//                     }
//                     <span style={{ marginRight: '10px' }}></span>
//                     <Button variant="outlined" size="small" onClick={handleCloseDialog} color="primary">
//                     닫기
//                     </Button>
//                     <span style={{ marginRight: '50px' }}></span>
//                 </div>
//             </DialogActions>
//         </div>
//     );

//     return (
//         <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop:"35px" }}>
//             <h2 style={{marginTop:"20px"}}>배치관리-작업목록</h2>
//             <CssBaseline />
//             {searchContent}
//             {loading ? <Loading/> : null}
//             {dataGridContent}
//             <Dialog maxWidth="lg"  open={openDialog} onClose={handleCloseDialog}>
//                 {loading ? <Loading/> : null}
//                 {dialogContent}
//             </Dialog>
//         </Box>
//     );
// }
