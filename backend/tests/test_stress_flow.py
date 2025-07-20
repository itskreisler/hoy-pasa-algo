import unittest
import json
from factory import create_app
from db.ORMcsv import orm
import os
import random


class StressFlowTest(unittest.TestCase):
    def setUp(self):
        os.environ["FLASK_ENV"] = "development"
        self.app = create_app("development")
        self.client = self.app.test_client()

        # Limpiar BBDD
        for model_name in ["usuario", "event", "favorite"]:
            if model_name in orm.models:
                model = orm.get_model(model_name)
                if os.path.exists(model.full_path):
                    os.remove(model.full_path)
                model._ensure_file()

        self.users = []
        for i in range(5):
            user_data = {"email": f"user{i}@test.com", "password": "password"}
            reg_resp = self.client.post("/api/v1/auth/register", data=json.dumps(user_data), content_type="application/json")
            self.assertEqual(reg_resp.status_code, 201, f"Failed to register user {i}")
            token = json.loads(reg_resp.data)["data"]["token"]
            user_id = json.loads(reg_resp.data)["data"]["user"]["id"]
            self.users.append({
                "id": user_id,
                "token": token,
                "headers": {"Authorization": f"Bearer {token}"},
                "events": []
            })

    def tearDown(self):
        for model_name in ["usuario", "event", "favorite"]:
            if model_name in orm.models:
                model = orm.get_model(model_name)
                if os.path.exists(model.full_path):
                    os.remove(model.full_path)

    def test_stress_flow(self):
        # 1. Cada usuario crea 3 eventos
        for user in self.users:
            for i in range(3):
                event_data = {
                    "title": f"Evento de {user['id']} número {i}",
                    "date": "2025-01-01",
                    "visibility": random.choice(["public", "private", "only_me"]),
                    "user_id": user["id"]
                }
                create_resp = self.client.post("/api/v1/events/", data=json.dumps(event_data), headers=user["headers"], content_type="application/json")
                self.assertEqual(create_resp.status_code, 201)
                user["events"].append(json.loads(create_resp.data)["data"])

        # 2. Cada usuario actualiza su perfil y un evento
        for i, user in enumerate(self.users):
            # Actualizar perfil
            update_profile_data = {"full_name": "Nombre Actualizado"}
            update_prof_resp = self.client.put(f"/api/v1/users/{user['id']}", data=json.dumps(update_profile_data), headers=user["headers"], content_type="application/json")
            self.assertEqual(update_prof_resp.status_code, 200, f"Failed to update profile for user {i}. Response: {update_prof_resp.data.decode()}")

            # Actualizar evento
            event_to_update = user["events"][0]
            update_event_data = {"title": "Título Actualizado"}
            update_event_resp = self.client.put(f"/api/v1/events/{event_to_update['id']}", data=json.dumps(update_event_data), headers=user["headers"], content_type="application/json")
            self.assertEqual(update_event_resp.status_code, 200)

        # 3. Un usuario (user 0) consulta los eventos y verifica la visibilidad
        response = self.client.get("/api/v1/events/", headers=self.users[0]["headers"])
        self.assertEqual(response.status_code, 200)
        visible_events = json.loads(response.data)["data"]

        user0_id = self.users[0]["id"]
        for event in visible_events:
            is_public = event["visibility"] == "public"
            is_own_private = event["visibility"] in ["private", "only_me"] and str(event["user_id"]) == str(user0_id)
            self.assertTrue(is_public or is_own_private)

        # 4. Cada usuario guarda eventos de otros como favoritos
        all_events = []
        for u in self.users:
            all_events.extend(u["events"])

        public_events_ids = [e["id"] for e in all_events if e["visibility"] == "public"]

        for user in self.users:
            event_to_fav = random.choice(public_events_ids)
            # Asegurarse de que no sea su propio evento
            while any(e["id"] == event_to_fav for e in user["events"]):
                event_to_fav = random.choice(public_events_ids)

            fav_resp = self.client.post("/api/v1/events/favorites", data=json.dumps({"event_id": event_to_fav}), headers=user["headers"], content_type="application/json")
            self.assertEqual(fav_resp.status_code, 201)

        # 5. Cada usuario consulta sus favoritos
        for user in self.users:
            favs_resp = self.client.get("/api/v1/events/favorites", headers=user["headers"])
            self.assertEqual(favs_resp.status_code, 200)
            self.assertGreater(len(json.loads(favs_resp.data)["data"]), 0)

        # 6. Un usuario (user 1) borra uno de sus eventos públicos
        user1 = self.users[1]
        event_to_delete = next((e for e in user1["events"] if e["visibility"] == "public"), None)
        self.assertIsNotNone(event_to_delete, "User 1 has no public events to delete")

        del_resp = self.client.delete(f"/api/v1/events/{event_to_delete['id']}", headers=user1["headers"])
        self.assertEqual(del_resp.status_code, 200)

        # 7. Otro usuario (user 2) consulta y verifica que el evento no está
        final_list_resp = self.client.get("/api/v1/events/", headers=self.users[2]["headers"])
        final_events = json.loads(final_list_resp.data)["data"]
        self.assertFalse(any(e["id"] == event_to_delete["id"] for e in final_events))


if __name__ == "__main__":
    unittest.main()
