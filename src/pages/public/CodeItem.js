import React, { useEffect, useState } from 'react';
import { Typography, TextField, Button } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Loading from '../spinner/Spinner';
import axios from 'axios';
import { useSelector } from "react-redux";

function CodeItem({ codeItem }) {
    const [isFlag, setIsFlag] = useState(false);
    const [loading, setLoading] = useState(false);
    const url = useSelector((state) => state.baseurl.url);
    const authToken = useSelector((state) => state.authToken.authToken);
    const [codeData, setCodeData] = useState({
      cl_code: '',
      code_id: '',
      code_nm: '',
      code_description: '',
  });

  useEffect(() => {
    if(codeItem){
      console.log(codeItem.cl_code);
      if(codeItem.code_id){
        setLoading(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
        axios.get(url+`/api/commcode/code/${codeItem.cl_code}/${codeItem.code_id}`)
        .then((response) => {
            setLoading(false);
            console.log(response.data);
            setCodeData(response.data);
        })
        .catch((error) => {
            setLoading(false);
            alert(error.response.data.detail);
            console.error('데이터 불러오기 실패:', error);
        });
    }
  }
  }, [codeItem, authToken, url]);

  const handleCodeChange = (event) => {
    const newValue = event.target.value;
    setCodeData({ ...codeData, code_id: newValue });
  };
  const handleNameChange = (event) => {
      const newValue = event.target.value;
      setCodeData({ ...codeData, code_nm: newValue });
  };
  const handleDescriptionChange = (event) => {
      const newValue = event.target.value;
      setCodeData({ ...codeData, code_description: newValue });
  };
  const handleClear = () => {
      setIsFlag(false)
      setCodeData([]);
  };
  const handleDelete = () => {
      // if (url!=='https://was-dos.incar.co.kr'){
      //     alert('잘못된 접근입니다.');
      //     return;
      // }
      setLoading(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      axios.delete(url+`/api/commcode/code/${codeData.code_id}`)
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
                          code_nm:codeData.code_nm
                          , code_description:codeData.code_description};
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      axios.patch(url+`/api/commcode/code/${codeData.code_id}`, send_data)
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
          cl_code:codeData.cl_code
          , code_id:codeData.code_id
          , code_nm:codeData.code_nm
          , code_description:codeData.code_description};
      console.log(send_data);
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      axios.post(url+`/api/commcode/code`, send_data)
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
      <Typography variant="h6"> 코드 상세 정보</Typography>        
      <div style={{ marginTop: '10px' }}>
          <FormControl variant="outlined" style={{ marginRight: '10px' }}>
              <TextField
                  id="outlined-read-only-input"
                  label="코드번호"
                  value={codeData.code_id || ""}
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
                  value={codeData.code_nm || ""}
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
              value={codeData.code_description || ""}
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
    </div>
  );
}

export default CodeItem;
