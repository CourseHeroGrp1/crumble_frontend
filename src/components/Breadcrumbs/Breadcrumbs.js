import "./Breadcrumbs.css"
import { useBreadcrumbs } from "hooks/useBreadcrumbs"
import { useEffect } from "react"




export default function Breadcrumbs ({mainId, subId}) {

    const { handleBackClick, handleForwardClick } = useBreadcrumbs({mainId, subId})

    useEffect (() => {

    })

    return (
        <div className="Breadcrumbs">
            <div className="backBtn">
                <i class="bi-arrow-left-circle" onClick={handleBackClick}></i>
            </div>
            <div className="forwardBtn">
                <i class="bi-arrow-right-circle" onClick={handleForwardClick}></i>
            </div>
        </div>
    )
}