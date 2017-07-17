import * as React from 'react';
import ImageTemplateList from "../image-template-list/image-template-list";
import { Header } from "../header/header";

export interface AppProps {

}

export interface AppState {
    imagePreviewUrl?: string;
    title: string;
}

export default class App extends React.Component<AppProps, AppState> {

    constructor(props: AppProps) {
        super(props);

        this.state = {
            imagePreviewUrl: undefined,
            title: "Photo Master"
        };
    }

    render(): JSX.Element {
        return (
            <div className="app">
                <Header title={this.state.title}></Header>
                <div className="app-body">
                    <ImageTemplateList imageChanged={(file) => { this.onImageSelected(file) }}>
                    </ImageTemplateList>
                </div>
            </div>
        );
    }

    onImageSelected(file: any): void {
        const url = URL.createObjectURL(file);
        this.setState({
            imagePreviewUrl: url
        })
    }
}