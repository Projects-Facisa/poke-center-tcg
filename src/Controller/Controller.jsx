import {useState} from "react"
import {RiHome6Fill} from "react-icons/ri";
import {AiFillProduct} from "react-icons/ai";
import {IoIosRadioButtonOn} from "react-icons/io";
import "./Controller.css"
import Table from "../Table/Table.jsx";

function Controller() {

    const [view, setView] = useState(1);

    return(
        <div id="controller">
            <div id="side-bar">
                <button onClick={() => setView(1)}><RiHome6Fill/></button>
                <button onClick={() => setView(2)}><AiFillProduct/></button>
                <button onClick={() => setView(3)}><IoIosRadioButtonOn/></button>
                <button onClick={() => setView(4)}><IoIosRadioButtonOn/></button>
                <button onClick={() => setView(5)}><IoIosRadioButtonOn/></button>
            </div>
            <div id="content">
                {view === 1 ? <Table/> : ""}
            </div>
        </div>
    )
}

export default Controller;