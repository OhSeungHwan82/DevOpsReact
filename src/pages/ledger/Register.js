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
// import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
// import TabList from '@mui/lab/TabList';
import Typography from '@mui/material/Typography';
import {Checkbox, FormControlLabel} from '@mui/material';
import {
    // DataGridPremium,
    GridToolbarContainer,
    GridToolbarExport,
  } from '@mui/x-data-grid-premium';
import {
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel
  } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';


// const url = localStorage.getItem("url");

// const authToken = localStorage.getItem("authToken");

function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }
export default function Register() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedOption, setSelectedOption] = React.useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [detailData, setDetailData] = useState([]);
    const [data, setData] = useState([]); // list data
    const [detailListdata, setDetailListData] = useState([]); // detail list data
    const [dsCombo01, setCombo01] = useState([]);
    const [isButtonSaveEnabled, setButtonSaveEnabled] = useState(true);
    const [isButtonCreateEnabled, setButtonCreateEnabled] = useState(true);
    const [isButtonConfirmEnabled, setButtonConfirmEnabled] = useState(true);
    const [isButtonExecEnabled, setButtonExecEnabled] = useState(true);
    const [isButtonDelEnabled, setButtonDelEnabled] = useState(true);
    const url = useSelector((state) => state.baseurl.url);
    const authToken = useSelector((state) => state.authToken.authToken);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = React.useState('1');
    const [isChecked, setIsChecked] = useState(true);
    const [file, setFile] = useState(null);
    const [showFileInput, setShowFileInput] = useState(false);
    // const [showCreateFileInput, setShowCreateFileInput] = useState(false);
    // const [showExecFileInput, setShowExecFileInput] = useState(false);
    // const [fileDownloadUrl, setFileDownloadUrl] = useState(null);
    // const [buttonStates, setButtonStates] = useState({
    //     buttonSave: true,  
    //     buttonCreate: true, 
    //     buttonTest: true, 
    //     buttonExec: true, 
    //   });


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

    useEffect(() => {
        // 초기화 데이터를 가져오는 함수
        const fetchData = async () => {
            try {
                console.log("authToken"+authToken);

                // 서버로부터 데이터 가져오기
                const response = await axios.get(url + `/api/public/commcode?cl_code=2&use_yb=1`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });

                console.log(response.data);

                // cl_code가 1인 것만 필터링하여 설정
                //const filteredData = response.data.list.filter(item => item.cl_code === "2");
                //console.log(filteredData);
                //setCombo01(response.data.list);
                if (isMounted) {
                    setCombo01(response.data.list);
                }
            } catch (error) {
                // if (isMounted) {
                //     fetchData();
                // }
                console.error('데이터 불러오기 실패:', error);
            }
        };
        let isMounted = true;
        // fetchData 함수를 마운트될 때 한 번만 호출
        fetchData();
        return ()=>{
            isMounted = false;
        };
    }, [authToken, url]); // useEffect의 두 번째 인자로 authToken을 추가하여 authToken이 변경될 때마다 실행되도록 함

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    // list 조회버튼 클릭
    const btnSearchClickHandler = () => {
        setLoading(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
        axios.get(url+`/api/ledgerDatabase/jubsu?gubun=`+selectedOption+`&search=`+searchTerm+`&page=1&limit=10000`)
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
        setSelectedOption('');
    };
    // 팝업 상세 데이터 가져오기
    const fetchDataForSelectedRow = (selectedRowId) => {
        setLoading(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        axios.get(url + `/api/ledgerDatabase/jubsu/${selectedRowId}`)
            .then((response) => {
                setLoading(false);
                console.log(response.data);
                setDetailData(response.data);
                setDetailListData(response.data.list);
                setButtonSaveEnabled(response.data.authSave === true);
                setButtonCreateEnabled(response.data.authCreate === true);
                setButtonConfirmEnabled(response.data.authConfirm === true);
                setButtonExecEnabled(response.data.authExec === true);
                setButtonDelEnabled(response.data.authDel === true);
                setIsChecked(response.data.is_valid === '1' ? true : false);
                setShowFileInput(response.data.request_file !== null && response.data.request_file!=='' ? true : false);
                // setShowCreateFileInput(response.data.create_file !== null && response.data.create_file!=='' ? true : false);
                // setShowExecFileInput(response.data.exec_file !== null && response.data.exec_file!=='' ? true : false);
                setFile(null);
                // setButtonStates({
                //     buttonSave: response.data.authSave,
                //     buttonCreate: response.data.authCreate,
                //     buttonTest: response.data.authTest,
                //     buttonExec: response.data.authExec,
                //   });
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
    

    const [gridHeight, setGridHeight] = useState(660);
    
    useEffect(() => {
        const handleResize = () => {
            console.log("gridHeight"+gridHeight)
            console.log("windowinnerHeight"+window.innerHeight)
        // 여기에서 화면 크기에 맞게 계산된 높이를 설정하십시오.
        const windowHeight = window.innerHeight;
        const headerHeight = 60; // 예시로 설정된 헤더의 높이
        setGridHeight(windowHeight - headerHeight);
        };
    
        // 초기 로딩 시에도 한 번 호출
        handleResize();
    
        // 화면 크기 변경 시 이벤트 핸들러 등록
        window.addEventListener('resize', handleResize);
    
        // 컴포넌트가 언마운트되면 이벤트 핸들러 제거
        return () => {
        window.removeEventListener('resize', handleResize);
        };
    }, [gridHeight]);
    // 데이터 그리드 내용
    const dataGridContent = (
        <Box sx={{ width: '100%', minHeight: gridHeight, overflowX: 'auto' }}>
            <DataGrid
                density="compact"
                rowHeight={40}
                rows={data}
                columns={columns}
                // slots={{
                //     toolbar: CustomToolbar,
                //   }}
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


    const detailColumns = [
        { field: 'column_value', headerName: '컬럼', width: 120, editable: false},
        { field: 'before_value', headerName: '변경전', width: 120, editable: false},
        { field: 'after_value', headerName: '변경후', width: 120, editable: false},
        { field: 'forecast_sql', headerName: '예상SQL', width: 550, sortable: false},
        { field: 'status_nm', headerName: '생성결과', width: 70, sortable: false},
        { field: 'result_nm', headerName: '실행결과', width: 70, sortable: false},
    ];
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    // dialog 닫기버튼 클릭
    const handleCloseDialog = () => {
        setOpenDialog(false);
        btnSearchClickHandler();
    };
    const handleFileDelete = () => {
        setDetailData({ ...detailData, request_file: null });
        setFile(null);
    };
    const handleRequestFileDown = () => {
        handleFileDownload('requestFiles', detailData.request_file);
    };
    const handleCreateFileDown = () => {
        handleFileDownload('createFiles', detailData.create_file);
    };
    const handleExecFileDown = () => {
        handleFileDownload('execFiles', detailData.exec_file);
    };
    const handleFileDownload = (path, downloadFile) => {
        setLoading(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        axios.get(url + `/api/ledgerDatabase/download/${path}/${downloadFile}`)
        .then((response) => {
            setLoading(false);
            console.log(response.headers['content-disposition']);
            // const disposition = response.headers.get('content-disposition');
            // console.log("disposition",disposition);
            // const fileName = disposition.split('filename=')[1];
            const fileName = downloadFile;
            //const blob = response.blob();
            const blob = new Blob([response.data]);
            const fileUrl = URL.createObjectURL(blob);
            // setFileDownloadUrl(fileUrl);
    
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = fileName || 'downloaded_file';
            document.body.appendChild(link);
            link.click();
    
            // 클릭 후에 DOM에서 링크를 제거합니다.
            document.body.removeChild(link);
        })
        .catch((error) => {
            setLoading(false);
            alert(error.response.data.detail);
            console.error('데이터 불러오기 실패:', error);
        });
    };
    const handleCheckboxChange = (event) => {
        setShowFileInput(event.target.checked);
    };
    const toggleCheckbox = () => {
        setIsChecked((prevChecked) => !prevChecked);
    };
    // request_sql 값을 변경하는 함수
    const handleRequestSqlChange = (event) => {
        // 입력 필드에서 값을 가져와서 detailData를 업데이트합니다.
        const newValue = event.target.value;
        setDetailData({ ...detailData, request_sql: newValue });
        setFile(null);
    };

    const handleUpdateDetailData = () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('requestSql', detailData.request_sql);
        formData.append('is_valid', isChecked ? '1' : '2');
        if (file) {
            formData.append('file', file);
        }
        for (const pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }
        
        // const send_data = {requestSql:detailData.request_sql, is_valid: isChecked ? '1' : '2',};
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'; // 이 부분 추가
        axios.patch(url+`/api/ledgerDatabase/jubsu/${detailData.pk}`, formData)
        .then((response) => {
            setLoading(false);
            console.log(response);
            if(response.status === 200){
                fetchDataForSelectedRow(detailData.pk);
                alert('저장되었습니다');
            } else {
                //alert('저장 오류');
                throw new Error('저장 오류: ' + response.data.detail);
            }
        })
        .catch((error) => {
            setLoading(false);
            console.error('실패:', error);
            //alert(error.response.data.detail);
            if (error.response && error.response.status === 422) {
                alert("필수 값이 누락되었습니다.");
                //alert(error.response.data.detail);
            }else if (error.response.status === 404){
                alert(error.response.data.detail);
            }else{
                alert('저장 오류');
            }
        });
    };

    const handleCreateSqlData = () => {
        setLoading(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        axios.post(url+`/api/ledgerDatabase/jubsu/${detailData.pk}/createsql`)
        .then((response) => {
            setLoading(false);
            if(response.status === 201){
                fetchDataForSelectedRow(detailData.pk);
                alert('SQL생성이 완료 되었습니다.');
            }else {
                throw new Error('SQL생성 오류: ' + response.data.detail);
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

    const handleConfirmSqlData = () => {
        setLoading(true);
        const send_data = {requestSql:detailData.request_sql};
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        axios.post(url+`/api/ledgerDatabase/jubsu/${detailData.pk}/confirmsql`, send_data)
        .then((response) => {
            setLoading(false);
            console.log(response);
            if(response.status === 201){
                fetchDataForSelectedRow(detailData.pk);
                alert('저장되었습니다');
            } else {
                //alert('저장 오류');
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

    // 20231111 s.j.b 실행쿼리
    const handleExecSqlData = () => {
        const confirmed = window.confirm('작업에 시간이 걸릴 수 있습니다.\nSQL을 실행하시겠습니까?');

        if (confirmed) {
            setLoading(true);
            axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
            axios.post(url+`/api/ledgerDatabase/jubsu/${detailData.pk}/execsql`)
            .then((response) => {
                setLoading(false);
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
                setLoading(false);
                console.error('실패:', error);
                if (error.response && error.response.status === 422) {
                    alert(error.response.data.detail);
                }else{
                    alert('SQL실행 오류');
                }
            });
        }
    }
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
          const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    
          if (fileExtension === 'txt') {
            console.log('올바른 파일 형식입니다.', selectedFile);
            setFile(event.target.files[0]);
            setDetailData({ ...detailData, request_sql: "" });
          } else {
            console.log('허용되지 않는 파일 형식입니다.');
            alert('허용되지 않는 파일 형식입니다.');
          }
        }
        
    };

    const handleDelete = () => {
        setLoading(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        axios.delete(url+`/api/ledgerDatabase/jubsu/${detailData.pk}`)
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

    // 상세에 있는 데이터 그리드
    const detailDataGridContent = (
        <Box sx={{ height: 470, width: 1110, marginTop:"10px"}}>
            {!showFileInput ? (
            <>
            <DataGrid
                density="compact"
                rows={detailListdata}
                rowHeight={35}
                columns={detailColumns}
                slots={{
                    toolbar: CustomToolbar,
                  }}
                initialState={{
                pagination: {
                    paginationModel: {
                    pageSize: 20,
                    },
                },
                }}
                pageSizeOptions={[5,10,20,100]}
                disableRowSelectionOnClick
            />
            </>
            ):(
            <div style={{ display: 'flex', height:"480px", alignItems: 'center', justifyContent: 'center',}}>
                <TextField
                    size="small"
                    disabled
                    label=""
                    value={file ? file.name: (detailData.exec_file ? detailData.exec_file : "")}
                    InputProps={{
                        readOnly: true,
                        style: {
                            height: "30px",
                            width: "400px",
                        },
                    }}
                />
                <Button variant="contained" size="small" color="success" onClick={handleExecFileDown} style={{height:"30px", marginLeft:"10px", marginRight:"5px"}}>
                다운로드
                </Button>
            </div>
            )}
        </Box>
    );

    // 팝업 내용
    const dialogContent = selectedRow ? (
        <div style={{ width: '1200px', height:'750px' }}>
            <DialogTitle>
                원장변경 접수 상세
            </DialogTitle>
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
                                    style: {
                                        height: "30px",
                                    },
                                }}
                                variant="outlined"
                                size="small"
                                style={{width:"140px"}}
                            />
                            <TextField
                                id="outlined-read-only-input"
                                label="제목"
                                focused
                                value={detailData.title}
                                InputProps={{
                                    readOnly: true,
                                    style: {
                                        height: "30px",
                                    },
                                }}
                                variant="outlined"
                                size="small"
                                style={{width:"720px",marginLeft:"10px"}}
                            />
                            <FormControlLabel
                            style={{
                                width: '250px', height:'30px', marginLeft:"10px"
                            }}
                            control={<Checkbox checked={showFileInput} onChange={handleCheckboxChange} disabled={!isButtonSaveEnabled}/>}
                            label="요청SQL 파일 업로드 처리"
                            />
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            <TabContext value={value}>
                                <Box >
                                    <Tab
                                    value="1"
                                    label={
                                        <Typography
                                        variant="body1"
                                        sx={{
                                            fontSize: '0.9rem',
                                        }}
                                        >
                                        요청SQL
                                        </Typography>
                                    }
                                    sx={{
                                        border: '1px solid #1976d2', // 탭에 테두리 추가
                                        borderRadius: '10px 10px 0 0', // 위쪽 모서리를 둥글게 처리
                                        background: value === '1' ? '#2196f3' : '', // 선택된 탭 배경색
                                        color: value === '1' ? 'white' : '', // 선택된 탭 글자색
                                        height: '30px',
                                        minHeight: '30px', // 최소 높이 설정
                                        }}
                                        onClick={(e) => handleChange(e, '1')}
                                    />
                                    <Tab
                                    value="2"
                                    label={
                                        <Typography
                                        variant="body1"
                                        sx={{
                                            fontSize: '0.9rem',
                                        }}
                                        >
                                        생성SQL
                                        </Typography>
                                    }
                                    sx={{
                                        border: '1px solid #1976d2', // 탭에 테두리 추가
                                        borderRadius: '10px 10px 0 0', // 위쪽 모서리를 둥글게 처리
                                        background: value === '2' ? '#2196f3' : '', // 선택된 탭 배경색
                                        color: value === '2' ? 'white' : '', // 선택된 탭 글자색
                                        height: '30px',
                                        minHeight: '30px', // 최소 높이 설정
                                        }}
                                        onClick={(e) => handleChange(e, '2')}
                                    />
                                    <Tab
                                    value="3"
                                    label={
                                        <Typography
                                        variant="body1"
                                        sx={{
                                            fontSize: '0.9rem',
                                        }}
                                        >
                                        실행SQL
                                        </Typography>
                                    }
                                    sx={{
                                        border: '1px solid #1976d2', // 탭에 테두리 추가
                                        borderRadius: '10px 10px 0 0', // 위쪽 모서리를 둥글게 처리
                                        background: value === '3' ? '#2196f3' : '', // 선택된 탭 배경색
                                        color: value === '3' ? 'white' : '', // 선택된 탭 글자색
                                        height: '30px',
                                        minHeight: '30px', // 최소 높이 설정
                                        }}
                                        onClick={(e) => handleChange(e, '3')}
                                    />
                                </Box>
                                <TabPanel value="1"
                                    style={{
                                        padding: '16px', // 패널 내부 패딩
                                        borderRadius: '0 10px 10px 10px',
                                        border: '1px solid #1976d2', // 패널 테두리
                                        borderTop: 'flex', // 상단 테두리 없애기
                                    }}
                                    >
                                    <div>
                                        {!showFileInput ? (
                                        <>
                                            <TextField
                                                id="request_sql"
                                                label=""
                                                value={detailData.request_sql}
                                                InputProps={{
                                                    readOnly: false,
                                                    style: {
                                                        height: "480px",
                                                    },
                                                }}
                                                onChange={handleRequestSqlChange}
                                                multiline
                                                rows={18}
                                                style={{width:"100%"}}
                                                variant="standard"
                                            />
                                        </>
                                        ):(
                                        <div>
                                        <div style={{ display: 'flex', height:"250px", alignItems: 'flex-end', justifyContent: 'center',}}>
                                            <Button
                                            variant="outlined"
                                            component="label"
                                            style={{height:"30px", marginLeft:"10px", marginRight:"5px"}}
                                            >
                                                <Typography
                                                    >
                                                    {"요청SQL파일첨부"}
                                                </Typography>
                                                <input type="file" accept=".txt" onChange={handleFileChange} style={{display: 'none'}}/>
                                            </Button>
                                            
                                            <TextField
                                                size="small"
                                                disabled
                                                label=""
                                                value={file ? file.name: (detailData.request_file ? detailData.request_file : "")}
                                                InputProps={{
                                                    readOnly: true,
                                                    style: {
                                                        height: "30px",
                                                        width: "400px",
                                                    },
                                                }}
                                            />
                                            <Button variant="contained" size="small" color="success" onClick={handleRequestFileDown} style={{height:"30px", marginLeft:"10px", marginRight:"5px"}}>
                                            다운로드
                                            </Button>
                                            <Button variant="contained" size="small" color="error" onClick={handleFileDelete} style={{height:"30px", marginLeft:"10px", marginRight:"5px"}}>
                                            삭제
                                            </Button>
                                        </div>
                                        <div style={{ display: 'flex', height:"230px", alignItems: 'flex-start', justifyContent: 'center',}}>
                                            ※ 첨부 가능한 파일 확장자는 TXT 입니다.
                                        </div>
                                        </div>
                                        )}
                                    </div>
                                </TabPanel>
                                <TabPanel value="2"
                                    style={{
                                        padding: '16px', // 패널 내부 패딩
                                        borderRadius: '0 10px 10px 10px',
                                        border: '1px solid #1976d2', // 패널 테두리
                                        borderTop: 'flex', // 상단 테두리 없애기
                                    }}
                                    >
                                    <div>
                                        {!showFileInput ? (
                                        <>
                                        <TextField
                                            id="response_sql"
                                            label=""
                                            focused
                                            value={detailData.response_sql}
                                            InputProps={{
                                                readOnly: true,
                                                style: {
                                                    height: "480px",
                                                },
                                            }}
                                            multiline
                                            rows={18}
                                            style={{width:"100%"}}
                                            variant="standard"
                                        />
                                        </>
                                        ):(
                                        <div style={{ display: 'flex', height:"480px", alignItems: 'center', justifyContent: 'center',}}>
                                            <TextField
                                                size="small"
                                                disabled
                                                label=""
                                                value={detailData.create_file ? detailData.create_file : ""}
                                                InputProps={{
                                                    readOnly: true,
                                                    style: {
                                                        height: "30px",
                                                        width: "400px",
                                                    },
                                                }}
                                            />
                                            <Button variant="contained" size="small" color="success" onClick={handleCreateFileDown} style={{height:"30px", marginLeft:"10px", marginRight:"5px"}}>
                                            다운로드
                                            </Button>
                                        </div>
                                        )}
                                    </div>
                                </TabPanel>
                                <TabPanel value="3"
                                    style={{
                                        padding: '16px', // 패널 내부 패딩
                                        borderRadius: '0 10px 10px 10px',
                                        border: '1px solid #1976d2', // 패널 테두리
                                        borderTop: 'flex', // 상단 테두리 없애기
                                    }}
                                    >
                                    {detailDataGridContent}
                                </TabPanel>
                            </TabContext>
                        </div>
                        
                        
                    </div>
                ) : (
                <p>Loading...</p>
                )}
            </DialogContent>
            <DialogActions style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width:"99%" }}>
                {detailData ? (
                    <>
                    <div style={{marginLeft:"20px"}}>
                        {isButtonDelEnabled ? (
                        <Button variant="contained" startIcon={<DeleteIcon />} size="small" color="error" onClick={handleDelete}>
                        삭제
                        </Button>
                        ) : <div></div>}
                        작업건수: {detailData.totalcount}
                    </div>
                    </>
                ) : (
                    <div></div>
                )}
                <div>
                    <FormControlLabel
                    control={<Checkbox checked={isChecked} onChange={toggleCheckbox}/>}
                    label="SQL검증"
                    />
                    <Button variant="contained" size="small" color="warning" onClick={handleExecSqlData} disabled={!isButtonExecEnabled}>
                    실행
                    </Button>
                    <span style={{ marginRight: '10px' }}></span>
                    <Button variant="contained" size="small" color="warning" onClick={handleConfirmSqlData} disabled={!isButtonConfirmEnabled}>
                    검토완료
                    </Button>
                    <span style={{ marginRight: '10px' }}></span>
                    <Button variant="contained" size="small" color="warning" onClick={handleCreateSqlData} disabled={!isButtonCreateEnabled}>
                    SQL생성
                    </Button>
                    <span style={{ marginRight: '10px' }}></span>
                    <Button variant="contained" size="small" color="primary" onClick={handleUpdateDetailData} disabled={!isButtonSaveEnabled}>
                    저장
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
        <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop:"35px" }}>
            <h2 style={{marginTop:"20px"}}>원장변경</h2>
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