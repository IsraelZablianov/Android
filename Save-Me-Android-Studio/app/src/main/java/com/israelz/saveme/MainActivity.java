package com.israelz.saveme;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.webkit.WebView;

public class MainActivity extends AppCompatActivity {
    private WebView mainWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mainWebView = new WebView(this);
        mainWebView.loadUrl("file:///android_asset/Save-Me/index.html");
        mainWebView.getSettings().setJavaScriptEnabled(true);
        setContentView(mainWebView);
    }

    @Override
    public void onBackPressed() {
        if (mainWebView.canGoBack()) {
            mainWebView.goBack();
        } else {
            finish();
        }
    }
}
