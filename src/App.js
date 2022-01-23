import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import SideMenu from "components/SideMenu";
import AppRoutes from "App.routes";
import {ToastContainer} from "react-toastify";
import LoadingScreen from "components/UI/LoadingScreen";
import {checkUser, finishAuthUser, finishPreAuth, startPreAuth,} from "store/actions/Auth.actions";
import {fetchData, setAppTheme} from "./store/actions/Main.actions";
import Header from "./components/Header";
import Modal from "react-modal";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.min.css";
import "assets/css/all.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./app.scss";
import "./assets/scss/theme/themes.scss";
import "animate.css";

const App = () => {
    const dispatch = useDispatch();
    const preAuth = useSelector((state) => state.auth.preAuth);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fn = async () => {

            Modal.setAppElement('body');

            dispatch(setAppTheme());

            const currentPath = location.pathname;
            dispatch(startPreAuth());

            try {
                await dispatch(checkUser())
                await dispatch(fetchData())
                dispatch(finishPreAuth());
                navigate(currentPath);
            } catch (error) {
                dispatch(finishPreAuth());
                dispatch(finishAuthUser());
                navigate('/');
            }
        }
        fn();
    }, []);

    const checkPathIsAuthPages = location.pathname === "/login" || location.pathname === "/signup";

    const [isMobileSideMenuOpen, setIsMobileSideMenuOpen] = useState(false);

    return (
        <div className="App" id="app">
            <ToastContainer/>
            {checkPathIsAuthPages ? null :
                <SideMenu isOpen={isMobileSideMenuOpen} setIsOpen={setIsMobileSideMenuOpen}/>
            }
            <div className={[checkPathIsAuthPages ? "full-width" : "width-minus-sidebar"].join(' ')}>
                {!checkPathIsAuthPages ? <Header
                    title={location.pathname.split('/')[1]}
                    isSideMenuOpen={isMobileSideMenuOpen}
                    setIsSideMenuOpen={setIsMobileSideMenuOpen}
                /> : null}
                {preAuth ? <AppRoutes/> : <LoadingScreen/>}
            </div>
        </div>
    );
};

export default App;
