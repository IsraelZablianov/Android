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
                <div onClick={() => { this.onMenuSelected() }}>
                    <img className="hamburger" src={menu} alt="menu" />
                </div>
                <SideNavbar 
                    {...this.props.sideNavbarProps}
                    showNav={this.state.showSideNav} 
                    onHideNav={() => {this.closeMenu()}}/>
            </div>
        );
    }

    onMenuSelected(): void {
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

