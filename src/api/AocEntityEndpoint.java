package api;

import api.PMF;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.response.CollectionResponse;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.datanucleus.query.JDOCursorHelper;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Nullable;
import javax.inject.Named;
import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;

@Api(name = "aocentityendpoint", namespace = @ApiNamespace(ownerDomain = "mycompany.com", ownerName = "mycompany.com", packagePath = "services"))
public class AocEntityEndpoint {

	/**
	 * This method lists all the entities inserted in datastore.
	 * It uses HTTP GET method and paging support.
	 *
	 * @return A CollectionResponse class containing the list of all entities
	 * persisted and a cursor to the next page.
	 */
	@SuppressWarnings({ "unchecked", "unused" })
	@ApiMethod(name = "listAocEntity")
	public CollectionResponse<AocEntity> listAocEntity(
			@Nullable @Named("cursor") String cursorString,
			@Nullable @Named("limit") Integer limit) {

		PersistenceManager mgr = null;
		Cursor cursor = null;
		List<AocEntity> execute = null;

		try {
			mgr = getPersistenceManager();
			Query query = mgr.newQuery(AocEntity.class);
			if (cursorString != null && cursorString != "") {
				cursor = Cursor.fromWebSafeString(cursorString);
				HashMap<String, Object> extensionMap = new HashMap<String, Object>();
				extensionMap.put(JDOCursorHelper.CURSOR_EXTENSION, cursor);
				query.setExtensions(extensionMap);
			}

			if (limit != null) {
				query.setRange(0, limit);
			}

			execute = (List<AocEntity>) query.execute();
			cursor = JDOCursorHelper.getCursor(execute);
			if (cursor != null)
				cursorString = cursor.toWebSafeString();

			// Tight loop for fetching all entities from datastore and accomodate
			// for lazy fetch.
			for (AocEntity obj : execute)
				;
		} finally {
			mgr.close();
		}

		return CollectionResponse.<AocEntity> builder().setItems(execute)
				.setNextPageToken(cursorString).build();
	}

	/**
	 * This method gets the entity having primary key id. It uses HTTP GET method.
	 *
	 * @param id the primary key of the java bean.
	 * @return The entity with primary key id.
	 */
	@ApiMethod(name = "getAocEntity")
	public AocEntity getAocEntity(@Named("id") Long id) {
		PersistenceManager mgr = getPersistenceManager();
		AocEntity aocentity = null;
		try {
			aocentity = mgr.getObjectById(AocEntity.class, id);
		} finally {
			mgr.close();
		}
		return aocentity;
	}

	/**
	 * This inserts a new entity into App Engine datastore. If the entity already
	 * exists in the datastore, an exception is thrown.
	 * It uses HTTP POST method.
	 *
	 * @param aocentity the entity to be inserted.
	 * @return The inserted entity.
	 */
	@ApiMethod(name = "insertAocEntity")
	public AocEntity insertAocEntity(AocEntity aocentity) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			//TODO Fixes insertion without ID, but generates random ID...
			if (aocentity.getId() != null) {
				if (containsAocEntity(aocentity)) {
					throw new EntityExistsException("Object already exists");
				}
			}
			mgr.makePersistent(aocentity);
		} finally {
			mgr.close();
		}
		return aocentity;
	}

	/**
	 * This method is used for updating an existing entity. If the entity does not
	 * exist in the datastore, an exception is thrown.
	 * It uses HTTP PUT method.
	 *
	 * @param aocentity the entity to be updated.
	 * @return The updated entity.
	 */
	@ApiMethod(name = "updateAocEntity")
	public AocEntity updateAocEntity(AocEntity aocentity) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			if (!containsAocEntity(aocentity)) {
				throw new EntityNotFoundException("Object does not exist");
			}
			mgr.makePersistent(aocentity);
		} finally {
			mgr.close();
		}
		return aocentity;
	}

	/**
	 * This method removes the entity with primary key id.
	 * It uses HTTP DELETE method.
	 *
	 * @param id the primary key of the entity to be deleted.
	 */
	@ApiMethod(name = "removeAocEntity")
	public void removeAocEntity(@Named("id") Long id) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			AocEntity aocentity = mgr.getObjectById(AocEntity.class, id);
			mgr.deletePersistent(aocentity);
		} finally {
			mgr.close();
		}
	}

	private boolean containsAocEntity(AocEntity aocentity) {
		PersistenceManager mgr = getPersistenceManager();
		boolean contains = true;
		try {
			mgr.getObjectById(AocEntity.class, aocentity.getId());
		} catch (javax.jdo.JDOObjectNotFoundException ex) {
			contains = false;
		} finally {
			mgr.close();
		}
		return contains;
	}

	private static PersistenceManager getPersistenceManager() {
		return PMF.get().getPersistenceManager();
	}

}
