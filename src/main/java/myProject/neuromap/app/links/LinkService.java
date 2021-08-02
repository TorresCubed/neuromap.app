package myProject.neuromap.app.links;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LinkService {

    private final LinkRepository linkRepository;

    @Autowired
    public LinkService(LinkRepository linkRepository) {
        this.linkRepository = linkRepository;
    }


    public List<Link> getLink() {
        return linkRepository.findAll();
    }

//    public void addNewLink(Link link) {
//        boolean exists = linkRepository.existsById(link.getIdea());
//        if(exists) {
//            throw new IllegalStateException("link exists");
//        }
//        linkRepository.save(link);
//    }

//    public void deleteIdea(String ideaId) {
//        boolean exists = linkRepository.existsById(ideaId);
//        if(!exists) {
//            throw new IllegalStateException("Idea " + ideaId + " does not exist.");
//        }
//        linkRepository.deleteById(ideaId);
//        linkRepository.deleteidea_link_listBylink_list(ideaId);
//    }

//
//    @Transactional
//    public void updateIdea(String ideaId, IdeaUpdate ideaUpdate) {
//        Idea idea = linkRepository.findById(ideaId).orElseThrow(() -> new IllegalStateException("Idea " + ideaId+ " does not exist."));
//        System.out.println("Targeting " + ideaId + " Content:" + ideaUpdate.getContent() + "\nTop: " + ideaUpdate.getTop()
//                + "\nLeft: " + ideaUpdate.getLeft() + "\nLink: " + ideaUpdate.getlink());
//
//        if(ideaUpdate.getlink() != null && !idea.getlinkList().contains(ideaUpdate.getlink())) {
//            idea.addLink(ideaUpdate.getlink());
//            System.out.println("link added");
//        }
//        if (ideaUpdate.getContent() != null && !idea.getContent().equals(ideaUpdate.getContent())) {
//            idea.setContent(ideaUpdate.getContent());
//        }
//        if (ideaUpdate.getLeft() != null && ideaUpdate.getLeft() >0 && idea.getLeft() != ideaUpdate.getLeft()) {
//            idea.setLeft(ideaUpdate.getLeft());
//        }
//        if (ideaUpdate.getTop() != null && ideaUpdate.getTop() >0 && idea.getTop() != ideaUpdate.getTop()) {
//            idea.setTop(ideaUpdate.getTop());
//        }
//    }

}
