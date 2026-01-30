import react, {useState, useEffect} from 'react'
import Header from '../../component/Header'
import Sidebar from '../../component/Sidebar'
import SmartSetup from '../smartsetup/SmartSetup'

const Layout = () => {
    const [open , setopen] = useState(true)
    const toggleSidebar = () => {
        setopen(!open)
    }

    return (
        <>
            <Sidebar open={open} />
            
            <div className={open ?'contentapp':''}>
                <Header toggleSidebar={toggleSidebar}/>
                <SmartSetup />
            </div>
        </>
    )
}

export default Layout;