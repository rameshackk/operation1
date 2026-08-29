import { supabaseAdmin, supabaseAnon } from '../lib/supabase.js';

async function main() {
  console.log('--- 1. Testing Supabase Admin Connection ---');
  const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  if (listError) {
    console.error('List users error:', listError);
    return;
  }
  console.log('Total users in Supabase Auth:', users.length);
  
  let adminUser = users.find(u => u.email === 'admin@gmail.com');
  if (adminUser) {
    console.log('Found existing admin@gmail.com with ID:', adminUser.id);
    const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(adminUser.id, {
      password: 'admin@123',
      email_confirm: true,
      user_metadata: { full_name: 'Admin' }
    });
    if (updateErr) console.error('Error updating password:', updateErr);
    else console.log('Password successfully synced in Supabase to admin@123!');
  } else {
    console.log('Creating admin@gmail.com in Supabase Auth...');
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@gmail.com',
      password: 'admin@123',
      email_confirm: true,
      user_metadata: { full_name: 'Admin' }
    });
    if (createErr) {
      console.error('Create admin error:', createErr);
      return;
    }
    adminUser = created.user;
    console.log('Created admin@gmail.com in Supabase Auth with ID:', adminUser.id);
  }

  // Ensure row in public.profiles table
  const { data: existingProfile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', adminUser.id)
    .single();

  if (!existingProfile) {
    console.log('Inserting profile in profiles table with role=admin...');
    const { error: insertErr } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: adminUser.id,
        email: 'admin@gmail.com',
        display_name: 'Admin',
        role: 'admin',
        is_onboarded: true
      });
    if (insertErr) console.error('Insert profile error:', insertErr);
    else console.log('Profile created in profiles table!');
  } else if (existingProfile.role !== 'admin') {
    console.log('Updating profile role to admin...');
    await supabaseAdmin
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', adminUser.id);
  } else {
    console.log('Profile already has role=admin in profiles table:', existingProfile);
  }

  console.log('\n--- 2. Testing Direct Supabase Client Login (admin@gmail.com / admin@123) ---');
  const { data: loginData, error: loginErr } = await supabaseAnon.auth.signInWithPassword({
    email: 'admin@gmail.com',
    password: 'admin@123'
  });

  if (loginErr) {
    console.error('❌ Supabase Login Failed:', loginErr.message);
  } else {
    console.log('✅ Supabase Login Succeeded!');
    console.log('User ID:', loginData.user?.id);
    console.log('Email:', loginData.user?.email);
    console.log('Session Access Token Generated:', loginData.session?.access_token ? 'YES' : 'NO');
  }

  console.log('\n--- 3. Testing Wrong Password Rejection ---');
  const { data: wrongData, error: wrongErr } = await supabaseAnon.auth.signInWithPassword({
    email: 'admin@gmail.com',
    password: 'wrong_password_xyz'
  });
  if (wrongErr) {
    console.log('✅ Wrong password correctly rejected by Supabase:', wrongErr.message);
  } else {
    console.warn('❌ Wrong password was not rejected!');
  }
}

main().catch(console.error);
