package myProject.neuromap.app.ideas;

public class IdeaUpdate {

    public String content = null;
    public Integer left = null;
    public Integer top = null;
    public String newLink = null;
    public String removeLink = null;

    public IdeaUpdate(String content, Integer left, Integer top, String newLink, String removeLink) {
        this.content = content;
        this.left = left;
        this.top = top;
        this.newLink = newLink;
        this.removeLink = removeLink;
    }

    public IdeaUpdate() {
    }

    public String getRemoveLink() {
        return removeLink;
    }

    public void setRemoveLink(String removeLink) {
        this.removeLink = removeLink;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getLeft() {
        return left;
    }

    public void setLeft(Integer left) {
        this.left = left;
    }

    public Integer getTop() {
        return top;
    }

    public void setTop(Integer top) {
        this.top = top;
    }

    public String getnewLink() {
        return newLink;
    }

    public void setnewLink(String newLink) {
        this.newLink = newLink;
    }
}
