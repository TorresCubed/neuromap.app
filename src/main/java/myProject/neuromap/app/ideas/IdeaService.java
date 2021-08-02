package myProject.neuromap.app.ideas;

import myProject.neuromap.app.links.Link;
import myProject.neuromap.app.links.LinkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
public class IdeaService {

    private final IdeaRepository ideaRepository;
    private final LinkRepository linkRepository;

    @Autowired
    public IdeaService(IdeaRepository ideaRepository, LinkRepository linkRepository) {
        this.ideaRepository = ideaRepository;
        this.linkRepository = linkRepository;
    }


    public List<Idea> getIdea() {
        return ideaRepository.findAll();
    }

    public void addNewIdea(Idea idea) {
        System.out.println(idea.getIdeaId());
        boolean exists = ideaRepository.existsById(idea.getIdeaId());
        if(exists) {
            throw new IllegalStateException("Id Taken");
        }
        ideaRepository.save(idea);
    }

    @Transactional
    public void deleteIdea(String ideaId) {
        boolean exists = ideaRepository.existsById(ideaId);
        if(!exists) {
            throw new IllegalStateException("Idea " + ideaId + " does not exist.");
        }
        ideaRepository.deleteById(ideaId);
        linkRepository.deleteLinkBytoId(ideaId);
    }


    @Transactional
    public void updateIdea(String ideaId, IdeaUpdate ideaUpdate) {
        Idea idea = ideaRepository.findIdeaByideaId(ideaId).orElseThrow(() -> new IllegalStateException("Idea " + ideaId+ " does not exist."));
        if(ideaUpdate.getnewLink() != null) {

            Link newLink = idea.addLink(ideaUpdate.getnewLink());
            if(newLink != null) {
                linkRepository.save(newLink);
            }
        }
        if(ideaUpdate.getRemoveLink() != null) {
            idea.removeLink(ideaUpdate.getRemoveLink());
            linkRepository.deleteSpecificLink(ideaId, ideaUpdate.getRemoveLink());
        }
        if (ideaUpdate.getContent() != null && !idea.getContent().equals(ideaUpdate.getContent())) {
            idea.setContent(ideaUpdate.getContent());
        }
        if (ideaUpdate.getLeft() != null && ideaUpdate.getLeft() >0 && idea.getLeft() != ideaUpdate.getLeft()) {
            idea.setLeft(ideaUpdate.getLeft());
        }
        if (ideaUpdate.getTop() != null && ideaUpdate.getTop() >0 && idea.getTop() != ideaUpdate.getTop()) {
            idea.setTop(ideaUpdate.getTop());
        }
    }

}
