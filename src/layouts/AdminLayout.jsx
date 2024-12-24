import { Outlet } from 'react-router-dom';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { isAdminAtom } from 'src/atoms/auth';
import AdminSideNav from 'src/components/AdminSideNav/AdminSideNav';
import AdminHeader from 'src/components/AdminHeader/AdminHeader';
import useModal from 'src/hooks/useModal';
import AlertModal from 'src/components/Modal/AlertModal';

const AdminLayout = () => {
    const [isAdmin] = useAtom(isAdminAtom);
    const { openAlertModal, closeAlertModal, isAlertOpen, alertContent } = useModal();

    useEffect(() => {
        if (!isAdmin) {
            openAlertModal(
                "권한 없음",
                "접근 권한이 없습니다.",
                () => {
                    window.location.href = "/";
                }
            );
        }
    }, [isAdmin, openAlertModal]);

    
    if (!isAdmin && !isAlertOpen) {
        return null;
    }

    return (
        <>
            {/* AlertModal */}
            <AlertModal
                isOpen={isAlertOpen}
                closeModal={closeAlertModal}
                title={alertContent?.title || ""}
                message={alertContent?.message || ""}
                onConfirm={alertContent?.onConfirm} 
            />
            <div className="adminPage">
                <div className="left">
                    <AdminSideNav />
                </div>
                <div className="right">
                    <AdminHeader />
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default AdminLayout;
