import React, { useEffect, useCallback } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../../redux/userSlice.js";
import { setBaseUrl } from "../../redux/baseUrl.js";
import { setAuthToken } from "../../redux/authToken.js";
import { setPage } from "../../redux/page.js";

// const url = localStorage.getItem("url");

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://incar.co.kr/">
        (주)인카금융서비스
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Login() {
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const host = urlParams.get('baseHost');
    const firstPage = urlParams.get('page');
    console.log('host updated:', host);
    // host가 변경될 때 실행되는 로직
    let newUrl = '';
    if (host && host === 'air.incar.co.kr') {
      newUrl = 'https://was-dos.incar.co.kr';
    } else if (host && host.indexOf('devair') !== -1) {
      newUrl = 'https://was-test-dos.incar.co.kr';
    } else {
      newUrl = 'http://127.0.0.1:8000';
    }
    // let firstPage = '';
    // firstPage = '1';
    console.log('newUrl updated:', newUrl);
    // Redux 스토어에 URL 업데이트
    dispatch(setBaseUrl({ baseurl: newUrl }));
    dispatch(setPage({ page: firstPage }));
  }, [dispatch]);
  const url = useSelector((state) => state.baseurl.url);
  // const page = useSelector((state) => state.page.firstPage);

  const authToken = useSelector((state) => state.authToken.authToken);
  useEffect(() => {    
    console.log('authToken updated:', authToken);
  }, [authToken]);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const urlParams = new URLSearchParams(window.location.search);
    const sawon_cd = urlParams.get('sawon_cd');
    const password = urlParams.get('password');
    window.history.replaceState({}, document.title, window.location.pathname);
    console.log("postdata"+url+sawon_cd+password);

    const sdata = url !== "http://127.0.0.1:8000"
    ? {
        sawon_cd: sawon_cd,
        password: password,
        // sawon_cd: data.get('sawon_cd'),
        // password: data.get('password'),
      }
    : {
        sawon_cd: data.get('sawon_cd'),
        password: data.get('password'),
      };
    axios.post(url+'/api/userInfo/logIn', sdata)
        .then(res => {
            console.log(res.data);
            // localStorage.setItem("authToken", res.data.data.accessToken)
            dispatch(setAuthToken({ authToken: res.data.data.accessToken }));
            
            localStorage.setItem("userInfo", JSON.stringify(res.data.data.user_info))
            //dispatch(login(JSON.stringify(res.data.data.user_info)));
            dispatch(loginUser(res.data.data.userInfo));
        })
        .catch(err => {
            alert("사원코드 또는 비밀번호를 잘못 입력했습니다.");
            console.log(url);
            console.log(err.response);
        })
  },[dispatch, url]);
  useEffect(() => {
    // URL이 변경될 때 실행되는 로직
    // console.log('URL updated:', url);
    if (url) {
      // 컴포넌트가 마운트되었을 때와 URL이 변경됐을 때만 실행
      handleSubmit({ preventDefault: () => {} });
    }
  }, [url, handleSubmit]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            로그인
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="sawon_cd"
              label="사원번호"
              name="sawon_cd"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}


// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
// import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
// import Grid from '@mui/material/Grid';
// import Box from '@mui/material/Box';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import Typography from '@mui/material/Typography';
// import Container from '@mui/material/Container';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import axios from 'axios';
// import { loginUser } from '../../redux/userSlice.js';
// import { useNavigate } from 'react-router-dom';

// const url = localStorage.getItem('url');

// const defaultTheme = createTheme();
// export default function Login() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [sawonCd, setSawonCd] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!sawonCd || !password) {
//       // 사용자가 필수 입력 항목을 모두 입력하지 않은 경우
//       //alert('사원코드와 비밀번호를 모두 입력하세요.');
//       return;
//     }
    
//     const sdata = {
//       sawon_cd: sawonCd,
//       password: password,
//     }; 
//     if(sdata.sawon_cd && sdata.password){
//       try {
//         const res = await axios.post(url + '/api/userInfo/logIn', sdata);
//         console.log("vvvvvvvvvvvvvvvvv"+res.data.data.accessToken);
//         localStorage.setItem('authToken', res.data.data.accessToken);
//         const aaaa = localStorage.getItem('authToken');
//         console.log("wwwwwwwwwwwwwww"+aaaa);
//         localStorage.setItem(
//           'userInfo',
//           JSON.stringify(res.data.data.userInfo)
//         );
//         console.log("eeeeeeeeeeeeee"+aaaa);
//         dispatch(loginUser(res.data.data.userInfo));
//         console.log("gggggggggggggg"+aaaa);
//         // 로그인 후 메인 페이지로 리다이렉트
//         navigate('/');
//       } catch (err) {
//         alert('사원코드 또는 비밀번호를 잘못 입력했습니다.');
//         console.log(url);
//         console.log(err.response);
//       }
//     }
//   };

//   useEffect(() => {
//     console.log("check");
//     const params = new URLSearchParams(window.location.search);
//     const urlSawonCd = params.get('sawon_cd');
//     const urlPassword = params.get('password');

//     // URL에 sawon_cd와 password 파라미터가 있을 때
//     const autoLogin = async () => {
//       if (urlSawonCd!==null && urlPassword!==null) {
//         // 자동으로 로그인하고 메인 페이지로 이동
//         console.log("urlSawonCd",urlSawonCd);
//         console.log("urlPassword",urlPassword);
//         await setSawonCd(urlSawonCd);
//         await setPassword(urlPassword);
//         console.log("sawonCd",sawonCd);
//         console.log("password",password);
//         await handleSubmit({
//           preventDefault: () => {},
//         });
//         //window.history.replaceState({}, document.title, window.location.pathname);
//       }
//     };
//     autoLogin();
//     console.log("Updated sawonCd", sawonCd);
//     console.log("Updated password", password);
//   }, [sawonCd,password]); // useEffect가 처음 한 번만 실행되도록 빈 배열 전달

//   return (
//     <ThemeProvider theme={defaultTheme}>
//       <Container component="main" maxWidth="xs">
//         <CssBaseline />
//         <Box
//           sx={{
//             marginTop: 8,
//             display: 'none',
//             flexDirection: 'column',
//             alignItems: 'center',
//           }}
//         >
//           <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
//             <LockOutlinedIcon />
//           </Avatar>
//           <Typography component="h1" variant="h5">
//             로그인
//           </Typography>
//           <Box
//             component="form"
//             onSubmit={handleSubmit}
//             noValidate
//             sx={{ mt: 1 }}
//             id="loginForm" // form element에 ID 추가
//           >
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="sawon_cd"
//               label="사원번호"
//               name="sawon_cd"
//               autoFocus
//               value={sawonCd}
//               onChange={(e) => setSawonCd(e.target.value)}
//             />
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               name="password"
//               label="Password"
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <FormControlLabel
//               control={<Checkbox value="remember" color="primary" />}
//               label="Remember me"
//             />
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3, mb: 2 }}
//             >
//               Sign In
//             </Button>
//             <Grid container>
//               <Grid item xs>
//                 <Link href="#" variant="body2">
//                   Forgot password?
//                 </Link>
//               </Grid>
//               <Grid item>
//                 <Link href="#" variant="body2">
//                   {"Don't have an account? Sign Up"}
//                 </Link>
//               </Grid>
//             </Grid>
//           </Box>
//         </Box>
//       </Container>
//     </ThemeProvider>
//   );
// }


// import React, { useState, useEffect } from 'react';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import CssBaseline from '@mui/material/CssBaseline';
// import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
// import Grid from '@mui/material/Grid';
// import Box from '@mui/material/Box';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import Typography from '@mui/material/Typography';
// import Container from '@mui/material/Container';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import axios from 'axios';
// import { useSelector, useDispatch } from "react-redux";
// import { loginUser } from "../../redux/userSlice.js";
// import { setUrl, initBaseHost  } from '../../redux/store';

// // const url = localStorage.getItem("url");

// function Copyright(props) {
//   return (
//     <Typography variant="body2" color="text.secondary" align="center" {...props}>
//       {'Copyright © '}
//       <Link color="inherit" href="https://incar.co.kr/">
//         (주)인카금융서비스
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }

// // TODO remove, this demo shouldn't need to reset the theme.

// const defaultTheme = createTheme();

// // const urlParams = new URLSearchParams(window.location.search);
// // const baseHost = urlParams.get('baseHost');

// export default function Login() {
//   const accessToken = useSelector((state) => state.accessToken);
//   const host = useSelector((state) => state.baseHost);
//   const url = useSelector((state) => state.user.url);
//   const dispatch = useDispatch();

//   // useEffect(() => {
//   //   // 앱이 초기화될 때 실행되어야 하는 로직
//   //   const urlParams = new URLSearchParams(window.location.search);
//   //   const baseHost = urlParams.get('baseHost');
//   //   console.log('baseHost :', baseHost);
//   //   dispatch(initBaseHost(baseHost));
//   // }, [dispatch]);

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const host = urlParams.get('baseHost');
//     console.log('host updated:', host);
//     // host가 변경될 때 실행되는 로직
//     let newUrl = '';
//     if (host && host === 'air.incar.co.kr') {
//       newUrl = 'https://was-dos.incar.co.kr';
//     } else {
//       newUrl = 'https://was-test-dos.incar.co.kr';
//     }
//     console.log('newUrl updated:', newUrl);
//     // Redux 스토어에 URL 업데이트
//     dispatch(setUrl(newUrl));
//   }, [dispatch]);

//   useEffect(() => {
//     // URL이 변경될 때 실행되는 로직
//     console.log('URL updated:', url);
//   }, [url]);

//   // const dispatch = useDispatch();

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const data = new FormData(event.currentTarget);
//     const sdata = {
//       sawon_cd: data.get('sawon_cd'),
//       password: data.get('password'),
//     };
//     axios.post(url+'/api/userInfo/logIn', sdata)
//         .then(res => {
//             console.log(res.data);
//             setAuthToken(res.data.data.accessToken);
//             //localStorage.setItem("authToken", res.data.data.accessToken)
//             localStorage.setItem("userInfo", JSON.stringify(res.data.data.user_info))
//             //dispatch(login(JSON.stringify(res.data.data.user_info)));
//             dispatch(loginUser(res.data.data.userInfo));
//         })
//         .catch(err => {
//             alert("사원코드 또는 비밀번호를 잘못 입력했습니다.");
//             console.log(url);
//             console.log(err.response);
//         })
//   };

//   return (
//     <ThemeProvider theme={defaultTheme}>
//       <Container component="main" maxWidth="xs">
//         <CssBaseline />
//         <Box
//           sx={{
//             marginTop: 8,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//           }}
//         >
//           <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
//             <LockOutlinedIcon />
//           </Avatar>
//           <Typography component="h1" variant="h5">
//             로그인
//           </Typography>
//           <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="sawon_cd"
//               label="사원번호"
//               name="sawon_cd"
//               autoFocus
//             />
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               name="password"
//               label="Password"
//               type="password"
//               id="password"
//             />
//             <FormControlLabel
//               control={<Checkbox value="remember" color="primary" />}
//               label="Remember me"
//             />
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3, mb: 2 }}
//             >
//               Sign In
//             </Button>
//             <Grid container>
//               <Grid item xs>
//                 <Link href="#" variant="body2">
//                   Forgot password?
//                 </Link>
//               </Grid>
//               <Grid item>
//                 <Link href="#" variant="body2">
//                   {"Don't have an account? Sign Up"}
//                 </Link>
//               </Grid>
//             </Grid>
//           </Box>
//         </Box>
//         <Copyright sx={{ mt: 8, mb: 4 }} />
//       </Container>
//     </ThemeProvider>
//   );
// }
