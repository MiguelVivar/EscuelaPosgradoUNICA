package com.escuelaposgrado.Autenticacion.security.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.escuelaposgrado.Autenticacion.model.entity.Usuario;
import com.escuelaposgrado.Autenticacion.repository.UsuarioRepository;

/**
 * Servicio para cargar detalles del usuario para Spring Security
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new UsernameNotFoundException(
                    "Usuario no encontrado con username o email: " + username));

        return usuario;
    }
}
