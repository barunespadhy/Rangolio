import sys
from PyQt6.QtWidgets import QApplication, QInputDialog, QWidget, QLineEdit, QMessageBox


def get_text_input(title, message, widget):
    text, ok = QInputDialog.getText(
        widget,
        title,
        message
    )
    
    if ok:
        return text
    else:
        return None
    
    
def get_password(title, message, widget):
    password, ok = QInputDialog.getText(
        widget,
        title,
        message,
        QLineEdit.EchoMode.Password
    )

    if ok:
        return password
    else:
        return None
    
    
def show_confirmation(title, message, widget):
    reply = QMessageBox.question(
        widget,
        title,
        message,
        QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No, 
        QMessageBox.StandardButton.No
    )

    if reply == QMessageBox.StandardButton.Yes:
        return True
    else:
        return False
        
        
def show_message_box(title, message, widget):
    QMessageBox.information(
        widget,
        title,
        message
    )
    return None
    
    
def draw_dialogue_box(title, message, dialogue_box_type):
    app = QApplication(sys.argv)
    widget = QWidget()
    widget.setWindowTitle('Password Dialog')
    
    if dialogue_box_type == 'textbox':
        return get_text_input(title, message, widget)
    if dialogue_box_type == 'password':
        return get_password(title, message, widget)
    if dialogue_box_type == 'confirmation':
        return show_confirmation(title, message, widget)
    if dialogue_box_type == 'message':
        return show_message_box(title, message, widget)
        
    app.exit()
