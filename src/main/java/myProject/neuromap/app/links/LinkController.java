package myProject.neuromap.app.links;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/link")
@CrossOrigin("*")
public class LinkController {

    private final LinkService linkService;

    @Autowired
    public LinkController(LinkService linkService) {
        this.linkService = linkService;
    }

    @GetMapping
    public List<Link> getLink() {
        return linkService.getLink();
    }

//    @PostMapping
//    public void addNewIdea(@RequestBody Link link) {
//        linkService.addNewLink(link);
//    }

//    @DeleteMapping(path = "{ideaId}")
//    public void deleteIdea(@PathVariable("ideaId") String ideaId) {
//        linkService.deleteLink(ideaId);
//    }
//
//
//    @PutMapping(path = "{id}")
//    public void updateIdea(
//            @PathVariable("id") String id,
//            @RequestBody IdeaUpdate ideaUpdate){
//        System.out.println("Targeting " + id + " Content:" + ideaUpdate.getContent() + "\nTop: " + ideaUpdate.getTop()
//                + "\nLeft: " + ideaUpdate.getLeft() + "\nLink: " + ideaUpdate.getlink());
//        linkService.updateLink(id, ideaUpdate);
//    }

}
