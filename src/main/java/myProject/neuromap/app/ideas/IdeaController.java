package myProject.neuromap.app.ideas;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/ideas")
@CrossOrigin("*")
public class IdeaController {

    private final IdeaService ideaService;

    @Autowired
    public IdeaController(IdeaService ideaService) {
        this.ideaService = ideaService;
    }

    @GetMapping
    public List<Idea> getIdeas() {
        return ideaService.getIdea();
    }

    @PostMapping
    public void addNewIdea(@RequestBody Idea idea) {
        ideaService.addNewIdea(idea);
    }

    @DeleteMapping(path = "{ideaId}")
    public void deleteIdea(@PathVariable("ideaId") String ideaId) {
        ideaService.deleteIdea(ideaId);
    }


    @PutMapping(path = "{ideaId}")
    public void updateIdea(
            @PathVariable("ideaId") String ideaId,
            @RequestBody IdeaUpdate ideaUpdate){
        ideaService.updateIdea(ideaId, ideaUpdate);
    }


}
