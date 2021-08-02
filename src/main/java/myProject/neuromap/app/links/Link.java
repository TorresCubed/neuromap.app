package myProject.neuromap.app.links;

import myProject.neuromap.app.ideas.Idea;

import javax.persistence.*;

@Entity
@Table
public class Link {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "ideaId", nullable=false)
    private Idea idea;
    private String toId;

    public Link(Long id, Idea idea, String toId) {
        this.id = id;
        this.idea = idea;
        this.toId = toId;
    }

    public Link() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Idea getIdea() {
        return idea;
    }

    public void setIdea(Idea idea) {
        this.idea = idea;
    }

    public String getToId() {
        return toId;
    }

    public void setToId(String toId) {
        this.toId = toId;
    }
}
