import { Link } from "react-router-dom";

export default function PageChatRight() {
    return (
        <div className='page-right'>
            <div className='page-right-head'>
                <div className='head-user'>
                    <div className='head-back'>
                        <Link 
                            to={{pathname:`/chats`}}
                        >
                            <img src="https://beautyx-spa.web.app/static/media/chevron-left.ac52a0ac09a2c0f64c752c5b4d237b5c.svg" alt=""/>
                        </Link>
                    </div>
                    <div className='head-avatar'>
                        <img src="http://myspa.local/files//avatar/20230217023406.jpg" alt=""/>
                    </div>
                    <div>
                        <div className='head-username'>
                            <div className='head-name'>Sói cô đơn</div>
                            <div className='head-status'>
                                <span></span>
                                <span>Online</span>
                            </div>
                        </div>
                        <div>@soicodon</div>
                    </div>
                </div>
                <div className='call'>
                    <button type="button" className="btn btn-link"><i className="fa fa-phone" aria-hidden="true"></i></button>
                    <button type="button" className="btn btn-link" disabled><i className="fa fa-video-camera" aria-hidden="true"></i></button>
                    <button type="button" className="btn btn-link"><i className="fa fa-exclamation" aria-hidden="true"></i></button>
                </div>
            </div>
            <div className='page-right-message'></div>
            <div className='page-right-foot'>
                <div className='list-icon'>
                    <button type="button" className="btn btn-link"><i className="fa fa-plus" aria-hidden="true"></i></button>
                    <button type="button" className="btn btn-link"><i className="fa fa-file-image-o" aria-hidden="true"></i></button>
                </div>
                <div className='content'>
                    <div className="input-group">
                        <input type="text" className="form-control" placeholder="Aa"/>
                        <button type="button" className="btn btn-link"><i className="fa fa-paper-plane" aria-hidden="true"></i></button>  
                    </div>
                </div>
                <div className='icon-like'>
                    <button type="button" className="btn btn-link"><i className="fa fa-thumbs-up" aria-hidden="true"></i></button>
                </div>
            </div>
        </div>
    );
}