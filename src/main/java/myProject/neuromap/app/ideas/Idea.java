package myProject.neuromap.app.ideas;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import myProject.neuromap.app.links.Link;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table
public class Idea {

    @Id
    private String ideaId;

    private Integer leftPos;
    private Integer topPos;
    private String content;
    @OneToMany(mappedBy = "idea",
    cascade = CascadeType.ALL)
    @JsonIgnoreProperties("idea")
    private Set<Link> linkList;

    public Idea() {
    }

    public Idea(String id, Integer left, Integer top, String content, Set<Link> linkList) {
        this.ideaId = id;
        this.leftPos = left;
        this.topPos = top;
        this.content = content;
        this.linkList = linkList;
    }

    public Set<Link> getlinkList() {
        return linkList;
    }

    public void setlinkList(Set<Link> linkList) {
        this.linkList = linkList;
    }

    public void removeLink(String link) {
        for (Link linkSet: this.linkList) {
            if(linkSet.getToId().equals(link)) {
                this.linkList.remove(linkSet);
                break;
            }
        }
    }

    public Link addLink(String link) {
        for (Link linkSet: this.linkList) {
            if(linkSet.getToId().equals(link)) {
                return null;
            }
        }
        Link newLink = new Link();
        newLink.setToId(link);
        newLink.setIdea(this);
        this.linkList.add(newLink);
        return newLink;
    }

    public String getIdeaId() {
        return ideaId;
    }

    public void setIdeaId(String ideaId) {
        this.ideaId = ideaId;
    }

    public int getLeft() {
        return leftPos;
    }

    public void setLeft(Integer left) {
        this.leftPos = left;
    }

    public int getTop() {
        return topPos;
    }

    public void setTop(Integer top) {
        this.topPos = top;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
