import * as React from 'react';
import { SideNavbar, SideNavbarProps } from "../side-nav/side-navbar";
const menu = require("../../../images/hamburger.png");

export interface HeaderProps {
    title: string;
    sideNavbarProps?: SideNavbarProps;
}

export interface HeaderState {
    showSideNav: boolean;
}

export class Header extends React.Component<HeaderProps, HeaderState> {
    constructor(props: HeaderProps) {
        super(props);
        this.state = {
            showSideNav: false
        };
    }

    render(): JSX.Element {
        return (
            <div className="header">
                <div className="header-title">
                    {this.props.title}
                </div>
                <div onClick={() => { this.openMenu() }}>
                    <img className="hamburger" src={menu} alt="menu" />
                </div>
                <SideNavbar navStyle={{width: '70%'}}
                    {...this.props.sideNavbarProps}
                    showNav={this.state.showSideNav} 
                    onHideNav={() => {this.closeMenu()}}>
                    <div className="side-nav-header">
                        {this.props.sideNavbarProps && this.props.sideNavbarProps.title || this.props.title}
                    </div>
                </SideNavbar>
            </div>
        );
    }

    openMenu(): void {
        this.setState({
            showSideNav: true
        });
    }

    closeMenu(): void {
        this.setState({
            showSideNav: false
        });
    }
}

