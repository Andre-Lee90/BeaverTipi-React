import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import OfficeInfo from "./pages/OfficeInfo";
import OfficeText from "./pages/OfficeText";
import OfficeMap from "./pages/OfficeMap";
import Listing from "./pages/Listing";
import ListingMng from "./pages/ListingMng";
import ListingNew from "./pages/ListingNew";
import Contract from "./pages/Contract";
import ContractMng from "./pages/ContractMng";
import ContractNew from "./pages/ContractNew";
import ContractProceeding from "./pages/ContractProceeding";
import { AxiosProvider } from "./context/AxiosProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";
//import ListingDetails from "./pages/ListingDetails_backup";
import { AESProvider } from "./context/AESProvider";
import PdfCoordinatePicker from "./components/PdfCoordinatePicker";
import { ContextMenuProvider } from "./context/ContextMenuContext";
import { useContextMenu } from "./context/ContextMenuContext";
import { useEffect } from "react";

const GlobalContextMenu = () => {
  const { contextMenu, setContextMenu } = useContextMenu();

  if (!contextMenu) return null;

  return (
    <ul
      style={{ top: contextMenu.y, left: contextMenu.x, position: "absolute" }}
      className="z-50 bg-white border rounded shadow-md text-sm w-40"
      onClick={() => setContextMenu(null)}
    >
      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">복사</li>
      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">삭제</li>
    </ul>
  );
};

export default function App() {
  useEffect(() => {
    const blockDefaultContext = (e) => e.preventDefault();
    document.addEventListener("contextmenu", blockDefaultContext);
    return () => document.removeEventListener("contextmenu", blockDefaultContext);
  }, []);
  return (

    <ContextMenuProvider>
      <AxiosProvider>
        <AESProvider>
          <Router>
            <ScrollToTop />
            <GlobalContextMenu />
            <Routes>

              {/* 첫 진입 시 자동 리디렉션 */}
              <Route path="/" element={<Navigate to="/broker/myoffice" replace />} />
              <Route path="/broker" element={<Navigate to="/broker/myoffice" replace />} />
              {
                //<Route path="/broker/myoffice/listing-details" element={<ListingDetails />} />
              }

              {/* 인증이 필요한 대시보드 라우트 */}
              < Route
                path="/broker/myoffice"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Home />} />

                {/* 실제 기능 라우트 */}
                <Route path="info" element={<OfficeInfo />}>
                  <Route path="text" element={<OfficeText />} />
                  
                </Route>

                <Route path="lstg" element={<Listing />}>
                  <Route path="mng/new" element={<ListingNew />} />
                  <Route path="mng/edit/:lstgId" element={<ListingNew />} />
                  <Route path="mng" element={<ListingMng />} />
                </Route>

                <Route path="cont" element={<Contract />}>
                  <Route path="mng" element={<ContractMng />} />
                  <Route path="new" element={<ContractNew />} />
                  <Route path="proceeding" element={<ContractProceeding />} />
                </Route>

                {/* 기타 내부 페이지 */}
                <Route path="profile" element={<UserProfiles />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="blank" element={<Blank />} />

                {/* Forms */}
                <Route path="form-elements" element={<FormElements />} />
                <Route path="pdf-coor" element={<PdfCoordinatePicker pdfFile="/표준임대차계약서.pdf" />} />
                {/* Tables */}
                <Route path="basic-tables" element={<BasicTables />} />

                {/* UI Elements */}
                <Route path="alerts" element={<Alerts />} />
                <Route path="avatars" element={<Avatars />} />
                <Route path="badge" element={<Badges />} />
                <Route path="buttons" element={<Buttons />} />
                <Route path="images" element={<Images />} />
                <Route path="videos" element={<Videos />} />

                {/* Charts */}
                <Route path="line-chart" element={<LineChart />} />
                <Route path="bar-chart" element={<BarChart />} />
              </Route>

              {/* 인증 관련 라우트 */}
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>

        </AESProvider>
      </AxiosProvider >
    </ContextMenuProvider>
  );
}
