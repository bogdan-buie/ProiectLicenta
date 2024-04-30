package com.example.graphicstools.dto;

public class ProjectAuthResponse {
   private boolean isAuthToView;
   private boolean isAuthToEdit;

    public ProjectAuthResponse() {
    }

    public ProjectAuthResponse(boolean isAuthToView, boolean isAuthToEdit) {
        this.isAuthToView = isAuthToView;
        this.isAuthToEdit = isAuthToEdit;
    }

    public boolean isAuthToView() {
        return isAuthToView;
    }

    public void setAuthToView(boolean authToView) {
        isAuthToView = authToView;
    }

    public boolean isAuthToEdit() {
        return isAuthToEdit;
    }

    public void setAuthToEdit(boolean authToEdit) {
        isAuthToEdit = authToEdit;
    }
}
