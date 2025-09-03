import { Outlet } from 'react-router-dom'

export default function AppRoot() {
    return (
        <div className="scroll-container">
            <div className="content-wrapper">
                <Outlet />
            </div>
        </div>
    )
}
