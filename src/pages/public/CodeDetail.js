import React, { useEffect, useState } from 'react';
import { Typography, TextField, Button, List, ListItem, ListItemText, ListSubheader, Grid } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Loading from '../spinner/Spinner';
import axios from 'axios';
import { useSelector } from "react-redux";


function CodeDetail({ codeDetail, onSelect }) {
    const [isFlag, setIsFlag] = useState(false);
    const [loading, setLoading] = useState(false);
    const [codes, setCodes] = useState([]);
    const url = useSelector((state) => state.baseurl.url);
    const authToken = useSelector((state) => state.authToken.authToken);
    const [detailData, setDetailData] = useState({
        cl_code: '',
        cl_name: '',
        cl_description: '',
    });

    useEffect(() => {
        if(codeDetail){
            setLoading(true);
            axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
            axios.get(url+`/api/commcode/codeclass/${codeDetail.cl_code}`)
            .then((response) => {
                setLoading(false);
                setIsFlag(true)
                console.log(response.data);
                setDetailData(response.data);
                setCodes(response.data.list);
            })
            .catch((error) => {
                setLoading(false);
                alert(error.response.data.detail);
                console.error('데이터 불러오기 실패:', error);
            });
        }
    }, [codeDetail, authToken, url]);

    // const handleAddCode = () => {
    //     setCodes([...codes, { code_id: newCode, code_nm: `Code ${newCode}` }]);
    //     setNewCode('');
    // };
    const handleCodeChange = (event) => {
        const newValue = event.target.value;
        setDetailData({ ...detailData, cl_code: newValue });
    };
    const handleNameChange = (event) => {
        const newValue = event.target.value;
        setDetailData({ ...detailData, cl_name: newValue });
    };
    const handleDescriptionChange = (event) => {
        const newValue = event.target.value;
        setDetailData({ ...detailData, cl_description: newValue });
    };
    const handleClear = () => {
        setIsFlag(false)
        setDetailData([]);
    };
    const handleDelete = () => {
        // if (url!=='https://was-dos.incar.co.kr'){
        //     alert('잘못된 접근입니다.');
        //     return;
        // }
        setLoading(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        axios.delete(url+`/api/commcode/codeclass/${detailData.cl_code}`)
        .then((response) => {
            setLoading(false);
            if(response.status === 204){
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
    const handleUpdate = () => {
        // if (url!=='https://was-dos.incar.co.kr'){
        //     alert('잘못된 접근입니다.');
        //     return;
        // }
        setLoading(true);        
        const send_data = {
                            cl_name:detailData.cl_name
                            , cl_description:detailData.cl_description};
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        axios.patch(url+`/api/commcode/codeclass/${detailData.cl_code}`, send_data)
        .then((response) => {
            setLoading(false);
            console.log(response);
            if(response.status === 200){
                // fetchDataForSelectedRow(detailData.pk);
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
    }
    const handleCreate = () => {
        // if (url!=='https://was-dos.incar.co.kr'){
        //     alert('잘못된 접근입니다.');
        //     return;
        // }
        setLoading(true);
        const send_data = {
            cl_code:detailData.cl_code
            , cl_name:detailData.cl_name
            , cl_description:detailData.cl_description};
        console.log(send_data);
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        axios.post(url+`/api/commcode/codeclass`, send_data)
        .then((response) => {
            setLoading(false);
            if(response.status === 201){
                alert('생성이 완료 되었습니다.');
            }else {
                console.log(response);
                throw new Error('생성 오류: ' + response.data.detail);
            }
        })
        .catch((error) => {
            setLoading(false);
            //console.error('실패:', error);
            if (error.response && error.response.status === 422) {
                alert(error.response.data.detail);
            }else{
                alert('생성 오류');
            }
        });
    }
    return (
        <div>
        <Typography variant="h6"> 코드 클래스 상세 정보</Typography>        
        <div style={{ marginTop: '10px' }}>
            <FormControl variant="outlined" style={{ marginRight: '10px' }}>
                <TextField
                    id="outlined-read-only-input"
                    label="코드번호"
                    value={detailData.cl_code || ""}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        readOnly: false,
                        style: {
                            height: "40px",
                            shrink: true,
                            fontSize: '14px'
                        },
                    }}
                    onChange={handleCodeChange}
                    variant="outlined"
                    style={{width:"210px"}}
                    disabled={isFlag}
                />
            </FormControl>
            <FormControl variant="outlined">
                <TextField
                    id="outlined-read-only-input"
                    label="코드이름"
                    value={detailData.cl_name || ""}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        readOnly: false,
                        style: {
                            height: "40px",
                            shrink: true,
                            fontSize: '14px'
                        },
                    }}
                    onChange={handleNameChange}
                    variant="outlined"
                    style={{width:"310px"}}
                />
            </FormControl>
        </div>
        <div style={{ marginTop: '20px' }}>
            <TextField
                id="description"
                label="코드설명"
                value={detailData.cl_description || ""}
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
                style={{width:"530px"}}
                variant="outlined"
                size="small"
            />
        </div>
        <div style={{ marginTop: '10px' }}>
            <Button variant="contained" color="error" onClick={handleDelete} style={{ marginRight: '10px' }}>
                삭제
            </Button>
            {isFlag ?
            <Button variant="contained" color="primary" onClick={handleUpdate} style={{ marginRight: '10px' }}>
                저장
            </Button>
            :
            <Button variant="contained" color="primary" onClick={handleCreate} style={{ marginRight: '10px' }}>
                등록
            </Button>
            }
            <Button variant="contained" color="primary" onClick={handleClear}>
                초기화
            </Button>
        </div>
        <List
            subheader={
                <ListSubheader 
                    component="div" 
                    style={{height:'50px',
                        backgroundColor: '#f5f5f5',
                        boxShadow: '0 4px 2px -2px gray',}}>
                    <Grid container style={{height:'100%'}}>
                        <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="body1" fontWeight="bold">
                                코드번호
                            </Typography>
                        </Grid>
                        <Grid item xs={9} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="body1" fontWeight="bold">
                                코드이름
                            </Typography>
                        </Grid>
                    </Grid>
                </ListSubheader>
            }
            style={{ maxHeight: '700px', overflow: 'auto', marginTop:'10px' }}
        >
        {codes.map((code) => (
            <ListItem button key={code.code_id} onClick={() => onSelect(code)}>
                <Grid container>
                    <Grid item xs={3} textAlign="center">
                        <ListItemText primary={code.code_id} />
                    </Grid>
                    <Grid item xs={9} textAlign="center">
                        <ListItemText primary={code.code_nm} />
                    </Grid>
                </Grid>
            </ListItem>
        ))}
        </List>
        </div>
    );
}

export default CodeDetail;
