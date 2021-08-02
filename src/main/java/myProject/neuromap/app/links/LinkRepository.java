package myProject.neuromap.app.links;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LinkRepository extends JpaRepository<Link, String> {

    Optional<Link> findLinkBytoId(String toId);

    @Modifying
    @Query(value = "DELETE FROM link WHERE idea_id = :ideaId AND to_id = :linkId", nativeQuery = true)
    Integer deleteSpecificLink(@Param("ideaId") String ideaId, @Param("linkId") String linkId);

    @Modifying
    @Query(value = "DELETE FROM link WHERE to_id = :ideaId", nativeQuery = true)
    Integer deleteLinkBytoId(@Param("ideaId") String ideaId);
}
