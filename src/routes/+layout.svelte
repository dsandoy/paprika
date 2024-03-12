<script lang="ts">
	import '../app.css'; // import the tailwind stuff
	import { FirebaseApp } from 'sveltefire';
	import { auth, firestore } from '$lib/Firebase';
</script>

<FirebaseApp {auth} {firestore}>
	<slot />
</FirebaseApp>
