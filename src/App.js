import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Login from './pages/auth/Login';
import { Routes, Route} from 'react-router-dom';
import Main from './pages/main/Main';
import { createTheme, ThemeProvider } from '@mui/material';
import { useSelector } from "react-redux";

const theme = createTheme({
	palette: {
		primary: {
			main: '#27398c',
		},
		secondary: {
			main: '#6c6e71',
		},
	},
})

function App() {
  const user = useSelector(state => state.user);
  console.log(user.sawon_cd);
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
          <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route  path="*" element={user.sawon_cd !== "" ? <Main/> : <Login/>}/>
          </Routes>
      </div>
    </ThemeProvider>
  );
}
export default App;
// import React, { useEffect } from 'react';
// import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
// import Main from './pages/main/Main';
// import Login from './pages/auth/Login';
// import { createTheme, ThemeProvider } from '@mui/material';
// import { useSelector } from 'react-redux';

// const theme = createTheme();

// function App() {
//   const user = useSelector((state) => state.user);

//   // URL에서 파라미터 읽기
//   const getQueryParam = (name) => {
//     const urlSearchParams = new URLSearchParams(window.location.search);
//     return urlSearchParams.get(name);
//   };

//   useEffect(() => {
//     const sawonCd = getQueryParam('sawon_cd');
//     const password = getQueryParam('password');

//     // URL에 sawon_cd와 password 파라미터가 있을 때
//     if (sawonCd && password) {
//       console.log(sawonCd);
//       console.log(password);
//       // 로그인 API 호출 또는 로그인 상태 업데이트 로직 추가

//       // 예시: Redux를 사용하여 상태 업데이트
//       // dispatch(loginUser({ sawon_cd: sawonCd, password: password }));

//       // 로그인 후 메인 페이지로 리다이렉트
//       // 여기에 로그인 API 호출 및 리다이렉트 로직을 추가하세요.
//     }
//   }, []); // useEffect가 처음 한 번만 실행되도록 빈 배열 전달

//   return (
//     <ThemeProvider theme={theme}>
//       <div className="App">
//         <Routes>
//           <Route
//             path="/login"
//             element={<Login />}
//           />
//           <Route
//             path="/"
//             element={user.sawon_cd !== "" ? <Main /> : <Navigate to="/login" />}
//           />
//         </Routes>
//       </div>
//     </ThemeProvider>
//   );
// }

// export default App;